export type SubnetInfo = {
  cidr: number;
  networkInt: bigint;
  broadcastInt: bigint;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  hostCount: bigint;
  wildcard: string;
  netmask: string;
  error?: string;
};

function ipToInt(ip: string): bigint | null {
  const parts = ip.trim().split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return null;
  }
  return (
    (BigInt(parts[0]) << 24n) +
    (BigInt(parts[1]) << 16n) +
    (BigInt(parts[2]) << 8n) +
    BigInt(parts[3])
  );
}

function intToIp(n: bigint): string {
  const o1 = Number((n >> 24n) & 255n);
  const o2 = Number((n >> 16n) & 255n);
  const o3 = Number((n >> 8n) & 255n);
  const o4 = Number(n & 255n);
  return `${o1}.${o2}.${o3}.${o4}`;
}

export function parseCidrInput(input: string): { ip: string; cidr: number } | null {
  const s = input.trim();
  const slash = s.split("/");
  if (slash.length !== 2) return null;
  const ip = slash[0].trim();
  const cidr = Number(slash[1]);
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) return null;
  if (ipToInt(ip) === null) return null;
  return { ip, cidr };
}

export function computeSubnet(ip: string, cidr: number): SubnetInfo {
  const addr = ipToInt(ip);
  if (addr === null) {
    return {
      cidr,
      networkInt: 0n,
      broadcastInt: 0n,
      network: "",
      broadcast: "",
      firstHost: "",
      lastHost: "",
      hostCount: 0n,
      wildcard: "",
      netmask: "",
      error: "Invalid IPv4 address.",
    };
  }

  if (cidr < 0 || cidr > 32) {
    return {
      cidr,
      networkInt: 0n,
      broadcastInt: 0n,
      network: "",
      broadcast: "",
      firstHost: "",
      lastHost: "",
      hostCount: 0n,
      wildcard: "",
      netmask: "",
      error: "CIDR must be between 0 and 32.",
    };
  }

  const mask =
    cidr <= 0
      ? 0n
      : cidr >= 32
        ? 0xffffffffn
        : (0xffffffffn << BigInt(32 - cidr)) & 0xffffffffn;
  const wildcard = (~mask) & 0xffffffffn;
  const networkInt = addr & mask;
  const broadcastInt = networkInt | wildcard;

  let firstHost = networkInt;
  let lastHost = broadcastInt;
  let hostCount = broadcastInt - networkInt + 1n;

  if (cidr === 32) {
    hostCount = 1n;
  } else if (cidr === 31) {
    firstHost = networkInt;
    lastHost = broadcastInt;
    hostCount = 2n;
  } else if (cidr < 31) {
    firstHost = networkInt + 1n;
    lastHost = broadcastInt - 1n;
    hostCount = lastHost >= firstHost ? lastHost - firstHost + 1n : 0n;
  }

  return {
    cidr,
    networkInt,
    broadcastInt,
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    hostCount,
    wildcard: intToIp(wildcard),
    netmask: intToIp(mask),
  };
}
