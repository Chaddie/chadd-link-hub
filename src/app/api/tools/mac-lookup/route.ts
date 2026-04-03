import { NextResponse } from "next/server";

/**
 * Proxies MAC → vendor lookup to avoid browser CORS.
 * Uses api.macvendors.com (public; rate limits apply — not for bulk scraping).
 */
export async function GET(req: Request) {
  const mac = new URL(req.url).searchParams.get("mac")?.trim();
  if (!mac) {
    return NextResponse.json({ error: "Missing mac parameter" }, { status: 400 });
  }

  const hex = mac.replace(/[^0-9a-fA-F]/g, "");
  if (hex.length !== 12) {
    return NextResponse.json(
      { error: "MAC must be 12 hex digits (e.g. AA:BB:CC:DD:EE:FF)" },
      { status: 400 }
    );
  }

  const formatted = hex.match(/.{2}/g)!.join(":").toUpperCase();

  try {
    const upstream = await fetch(
      `https://api.macvendors.com/${encodeURIComponent(formatted)}`,
      {
        headers: { Accept: "text/plain,*/*" },
        next: { revalidate: 86400 },
      }
    );

    const body = (await upstream.text()).trim();

    if (!upstream.ok || !body || body.toLowerCase().includes("not found")) {
      return NextResponse.json(
        {
          error:
            upstream.ok && (!body || body.toLowerCase().includes("not found"))
              ? "Vendor not found for this OUI"
              : "Lookup failed. Try again later.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ vendor: body, mac: formatted });
  } catch {
    return NextResponse.json(
      { error: "Network error during vendor lookup" },
      { status: 502 }
    );
  }
}
