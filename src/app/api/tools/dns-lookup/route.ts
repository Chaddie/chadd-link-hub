import dns from "node:dns/promises";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED = [
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "NS",
  "PTR",
  "SOA",
  "SRV",
  "TXT",
] as const;

type AllowedType = (typeof ALLOWED)[number];

function isAllowedType(t: string): t is AllowedType {
  return (ALLOWED as readonly string[]).includes(t);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hostname = String(body?.hostname ?? "").trim();
    const type = String(body?.type ?? "A").toUpperCase();

    if (!hostname || hostname.length > 253) {
      return NextResponse.json({ error: "Enter a valid hostname." }, { status: 400 });
    }
    if (!isAllowedType(type)) {
      return NextResponse.json({ error: "Unsupported record type." }, { status: 400 });
    }

    try {
      const records = await dns.resolve(hostname, type);
      return NextResponse.json({ hostname, type, records });
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      return NextResponse.json(
        { error: err.message || "DNS query failed.", code: err.code },
        { status: 422 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "DNS lookup failed." }, { status: 500 });
  }
}
