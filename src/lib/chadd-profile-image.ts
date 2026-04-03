import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Default headshot: first match under `public/` (replace with your photo).
 * Read on each call so dev/prod pick up file changes without a stale module cache.
 */
const FALLBACK_JPEG_BASE64 =
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

const PUBLIC_CANDIDATES = [
  "profile-avatar.jpg",
  "profile-avatar.jpeg",
  "profile-avatar.png",
  "profile-avatar.webp",
] as const;

function mimeFromBuffer(buf: Buffer): string {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return "image/jpeg";
}

/** Inline data URL for the default profile image (reads `public/profile-avatar.*` each time). */
export function getDefaultProfileImageDataUrl(): string {
  for (const name of PUBLIC_CANDIDATES) {
    const path = join(process.cwd(), "public", name);
    if (!existsSync(path)) continue;
    try {
      const buf = readFileSync(path);
      if (buf.length > 0) {
        const mime = mimeFromBuffer(buf);
        return `data:${mime};base64,${buf.toString("base64")}`;
      }
    } catch {
      /* try next */
    }
  }
  return `data:image/jpeg;base64,${FALLBACK_JPEG_BASE64}`;
}
