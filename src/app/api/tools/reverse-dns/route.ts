import dns from "node:dns/promises";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ip = String(body?.ip ?? "").trim();
    if (!ip) {
      return NextResponse.json({ error: "Enter an IP address." }, { status: 400 });
    }

    try {
      const hostnames = await dns.reverse(ip);
      return NextResponse.json({ ip, hostnames });
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      return NextResponse.json(
        { error: err.message || "Reverse lookup failed.", code: err.code },
        { status: 422 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Reverse DNS failed." }, { status: 500 });
  }
}
