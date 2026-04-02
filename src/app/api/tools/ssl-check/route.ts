import tls from "node:tls";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function fmtName(obj: unknown): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj !== "object" || Array.isArray(obj)) return "";
  const o = obj as Record<string, string | string[] | undefined>;
  return ["CN", "O", "OU", "L", "ST", "C"]
    .map((k) => {
      const v = o[k];
      if (v === undefined || v === null) return null;
      const s = Array.isArray(v) ? v.join(", ") : v;
      return `${k}=${s}`;
    })
    .filter(Boolean)
    .join(", ");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const host = String(body?.host ?? "").trim().replace(/^https?:\/\//i, "").split("/")[0];
    const port = Number(body?.port ?? 443) || 443;
    if (!host || host.length > 253) {
      return NextResponse.json({ error: "Enter a valid hostname." }, { status: 400 });
    }
    if (port < 1 || port > 65535) {
      return NextResponse.json({ error: "Port must be 1–65535." }, { status: 400 });
    }

    const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
      const socket = tls.connect({
        host,
        port,
        servername: host,
        rejectUnauthorized: false,
      });
      const timer = setTimeout(() => {
        socket.destroy();
        reject(new Error("Connection timed out."));
      }, 15000);

      socket.on("secureConnect", () => {
        clearTimeout(timer);
        const cert = socket.getPeerCertificate(true);
        socket.end();

        if (!cert || Object.keys(cert).length === 0) {
          resolve({ error: "No certificate presented." });
          return;
        }

        const sans =
          typeof cert.subjectaltname === "string"
            ? cert.subjectaltname
                .split(", ")
                .map((s) => s.replace(/^DNS:/i, "").trim())
                .filter(Boolean)
            : [];

        resolve({
          subject: fmtName(cert.subject),
          issuer: fmtName(cert.issuer),
          serialNumber: cert.serialNumber ?? "",
          validFrom: cert.valid_from ?? "",
          validTo: cert.valid_to ?? "",
          fingerprint256: cert.fingerprint256 ?? "",
          subjectAltNames: sans,
          authorized: socket.authorized,
          authorizationError: socket.authorizationError ?? null,
        });
      });

      socket.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    if ("error" in result && typeof result.error === "string") {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({ result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SSL check failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
