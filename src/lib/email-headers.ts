/** Lightweight RFC5322-style header folding parser for analysis UI */

export type ParsedEmailHeaders = {
  rawHeaderBlock: string;
  headers: Record<string, string[]>;
  received: string[];
  authenticationResults: string[];
  arcAuthResults: string[];
  dkimSignature: string[];
  from: string[];
  to: string[];
  subject: string[];
  date: string[];
  messageId: string[];
  returnPath: string[];
  replyTo: string[];
  listUnsubscribe: string[];
};

function splitHeadersAndBody(raw: string) {
  const idx = raw.search(/\r?\n\r?\n/);
  if (idx === -1) return { headers: raw.trim(), body: "" };
  return {
    headers: raw.slice(0, idx).trimEnd(),
    body: raw.slice(idx).replace(/^\r?\n\r?/, ""),
  };
}

export function parseEmailHeaders(raw: string): ParsedEmailHeaders {
  const { headers: block } = splitHeadersAndBody(raw);
  const lines = block.split(/\r?\n/);
  const folded: string[] = [];
  for (const line of lines) {
    if (/^[ \t]/.test(line) && folded.length) {
      folded[folded.length - 1] += " " + line.trim();
    } else if (line.trim()) {
      folded.push(line);
    }
  }

  const headers: Record<string, string[]> = {};
  for (const line of folded) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    if (!headers[key]) headers[key] = [];
    headers[key].push(val);
  }

  const get = (k: string) => headers[k] ?? [];

  return {
    rawHeaderBlock: block,
    headers,
    received: get("received"),
    authenticationResults: get("authentication-results"),
    arcAuthResults: get("arc-authentication-results"),
    dkimSignature: get("dkim-signature"),
    from: get("from"),
    to: get("to"),
    subject: get("subject"),
    date: get("date"),
    messageId: get("message-id"),
    returnPath: get("return-path"),
    replyTo: get("reply-to"),
    listUnsubscribe: get("list-unsubscribe"),
  };
}

export function summarizeAuth(parsed: ParsedEmailHeaders): string[] {
  const lines: string[] = [];
  const blob = [
    ...parsed.authenticationResults,
    ...parsed.arcAuthResults,
  ].join(" ");
  if (!blob.trim()) {
    lines.push("No Authentication-Results / ARC headers found.");
    return lines;
  }
  const spf = blob.match(/\bspf=\s*(\w+)/i);
  const dkim = blob.match(/\bdkim=\s*(\w+)/i);
  const dmarc = blob.match(/\bdmarc=\s*(\w+)/i);
  if (spf) lines.push(`SPF (from combined auth headers): ${spf[1]}`);
  if (dkim) lines.push(`DKIM (from combined auth headers): ${dkim[1]}`);
  if (dmarc) lines.push(`DMARC (from combined auth headers): ${dmarc[1]}`);
  if (lines.length === 0) lines.push("Auth headers present; expand rows below for detail.");
  return lines;
}
