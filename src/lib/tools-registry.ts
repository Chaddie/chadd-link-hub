export type ToolDefinition = {
  slug: string;
  title: string;
  description: string;
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "subnet-calculator",
    title: "Subnet calculator",
    description:
      "CIDR, network/broadcast addresses, usable host range, and wildcard mask.",
  },
  {
    slug: "password-generator",
    title: "Password generator",
    description: "Cryptographically random passwords with length and charset options.",
  },
  {
    slug: "port-reference",
    title: "Port reference",
    description: "Common TCP/UDP ports and typical services.",
  },
  {
    slug: "ip-geolocation",
    title: "IP geolocation",
    description: "Lookup location, ISP, and ASN via ipapi.co.",
  },
  {
    slug: "ssl-checker",
    title: "SSL certificate checker",
    description: "TLS certificate validity, issuer, SANs, and key details.",
  },
  {
    slug: "email-header-analyser",
    title: "Email header analyser",
    description: "Parse headers for SPF, DKIM, DMARC, routing, and metadata.",
  },
  {
    slug: "dns-lookup",
    title: "DNS lookup",
    description: "Query A, AAAA, MX, TXT, NS, CNAME, and more.",
  },
  {
    slug: "http-status-codes",
    title: "HTTP status codes",
    description: "Reference table of common HTTP status codes.",
  },
  {
    slug: "reverse-dns",
    title: "Reverse DNS",
    description: "PTR records for IPv4 and IPv6 addresses.",
  },
  {
    slug: "autopilot-hash-decoder",
    title: "Autopilot hash decoder",
    description:
      "Decode a Windows Autopilot hardware hash to inspect embedded device metadata.",
  },
  {
    slug: "spf-generator",
    title: "SPF record generator",
    description: "Build a v=spf1 TXT line from IPs, includes, and policy.",
  },
  {
    slug: "base64-file-converter",
    title: "Base64 file converter",
    description: "Encode files to Base64 or decode Base64 to a downloadable file.",
  },
  {
    slug: "yaml-json-converter",
    title: "YAML ↔ JSON converter",
    description: "Convert between YAML and JSON in the browser.",
  },
  {
    slug: "regex-tester",
    title: "Regex tester",
    description: "JavaScript RegExp tester with matches and replacement preview.",
  },
  {
    slug: "mime-converter",
    title: "MIME type converter",
    description: "Map extensions to MIME types and back.",
  },
  {
    slug: "qr-code-generator",
    title: "QR code generator",
    description: "Create a QR image from text or a URL and download PNG.",
  },
  {
    slug: "mac-address-lookup",
    title: "MAC address lookup",
    description: "OUI vendor hint from a device MAC address.",
  },
  {
    slug: "imperial-metric-converter",
    title: "Imperial / metric converter",
    description: "Length, mass, volume, and temperature conversions.",
  },
];

const slugByCompact = new Map<string, string>();
for (const t of TOOLS) {
  slugByCompact.set(t.slug.replace(/-/g, "").toLowerCase(), t.slug);
}

/** Resolve URLs like /tools/DNSLookup or /tools/dns-lookup to canonical slug */
export function resolveToolSlug(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const direct = trimmed.toLowerCase();
  if (TOOLS.some((t) => t.slug === direct)) return direct;
  const compact = direct.replace(/-/g, "");
  return slugByCompact.get(compact) ?? null;
}

export function getTool(slug: string): ToolDefinition | undefined {
  const resolved = resolveToolSlug(slug);
  if (!resolved) return undefined;
  return TOOLS.find((t) => t.slug === resolved);
}
