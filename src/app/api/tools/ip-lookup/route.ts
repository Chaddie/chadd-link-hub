import { NextResponse } from "next/server";

export const runtime = "nodejs";

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_LOOSE = /^[0-9a-f:]+$/i;

function isValidIp(ip: string) {
  const t = ip.trim();
  if (IPV4.test(t)) return true;
  if (IPV6_LOOSE.test(t) && t.includes(":")) return true;
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ip = String(body?.ip ?? "").trim();
    if (!ip || !isValidIp(ip)) {
      return NextResponse.json({ error: "Enter a valid IPv4 or IPv6 address." }, { status: 400 });
    }

    const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
    const res = await fetch(url, {
      headers: { "User-Agent": "chadd-link-hub/1.0" },
      next: { revalidate: 0 },
    });
    const data = (await res.json()) as Record<string, unknown>;

    if (data.error) {
      return NextResponse.json(
        { error: String(data.reason ?? data.error) },
        { status: 422 }
      );
    }

    return NextResponse.json({ data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
}
