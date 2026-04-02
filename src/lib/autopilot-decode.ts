/**
 * Windows Autopilot hardware hash is typically base64-encoded XML (hardware inventory).
 * Decoding is best-effort: extract common SMBIOS / manufacturer fields when present.
 */

export type AutopilotDecodeResult = {
  decodedUtf8: string;
  fields: Record<string, string>;
  note: string;
};

const TAGS = [
  "Manufacturer",
  "Model",
  "SerialNumber",
  "OEMManufacturerName",
  "OEMModelName",
  "Product",
  "DeviceSerialNumber",
  "SMBIOSUUID",
  "SystemManufacturer",
  "SystemProductName",
  "BIOSVendor",
  "BaseBoardManufacturer",
  "BaseBoardProduct",
];

export function decodeAutopilotHardwareHash(input: string): AutopilotDecodeResult {
  const cleaned = input.replace(/\s+/g, "").trim();
  if (!cleaned) {
    return { decodedUtf8: "", fields: {}, note: "Paste a hardware hash first." };
  }

  let binary: string;
  try {
    if (typeof atob === "undefined") {
      return {
        decodedUtf8: "",
        fields: {},
        note: "Base64 decoding requires a browser environment.",
      };
    }
    binary = atob(cleaned);
  } catch {
    return {
      decodedUtf8: "",
      fields: {},
      note: "Could not decode as base64. Check you copied the full hash.",
    };
  }

  let decodedUtf8 = binary;
  try {
    if (typeof TextDecoder !== "undefined") {
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      decodedUtf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    }
  } catch {
    decodedUtf8 = binary;
  }

  const fields: Record<string, string> = {};
  for (const tag of TAGS) {
    const re = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
    const m = decodedUtf8.match(re);
    if (m?.[1]) fields[tag] = m[1].trim();
  }

  const note =
    Object.keys(fields).length > 0
      ? "Extracted fields from decoded XML-like content. If fields are empty, the blob may use different tag names; see raw preview below."
      : "No known XML tags found. The hardware hash may still be valid — Microsoft OA3Tool can validate/decode the full structure. Raw decoded text is shown below.";

  return { decodedUtf8, fields, note };
}
