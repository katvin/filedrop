import { isIP } from 'node:net';

// Treat local IPv4 peers as being in the same /24 subnet.
const ipv4SubnetParts = 3;
// Treat local IPv6 peers as being in the same /64 subnet.
const ipv6SubnetHextets = 4;

function normalizeAddress(address?: string) {
  if (!address) {
    return undefined;
  }

  let normalized = address.trim().split(',')[0]?.trim();
  if (!normalized) {
    return undefined;
  }

  const bracketedIPv6 = normalized.match(/^\[([^[\]]+)\](?::\d+)?$/)?.[1];
  if (bracketedIPv6) {
    normalized = bracketedIPv6;
  }

  const ipv4WithPort = normalized.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/)?.[1];
  if (ipv4WithPort) {
    normalized = ipv4WithPort;
  }

  normalized = normalized.replace(/^::ffff:/i, '').split('%')[0]!;
  return normalized;
}

function ipv6Subnet(address: string) {
  const [leftRaw, rightRaw = ''] = address.toLowerCase().split('::');
  const left = leftRaw ? leftRaw.split(':').filter(Boolean) : [];
  const right = rightRaw ? rightRaw.split(':').filter(Boolean) : [];

  if (left.length + right.length > 8) {
    return undefined;
  }

  const missing = 8 - (left.length + right.length);
  const hextets = [...left, ...Array.from({ length: missing }, () => '0'), ...right];
  if (hextets.length !== 8) {
    return undefined;
  }

  const normalized = hextets.map((hextet) => hextet.padStart(4, '0'));
  return normalized.slice(0, ipv6SubnetHextets).join(':');
}

export function isSameLocalNetwork(left?: string, right?: string) {
  const leftAddress = normalizeAddress(left);
  const rightAddress = normalizeAddress(right);
  if (!leftAddress || !rightAddress) {
    return false;
  }

  const leftType = isIP(leftAddress);
  const rightType = isIP(rightAddress);
  if (!leftType || leftType !== rightType) {
    return false;
  }

  if (leftType === 4) {
    return (
      leftAddress.split('.').slice(0, ipv4SubnetParts).join('.') ===
      rightAddress.split('.').slice(0, ipv4SubnetParts).join('.')
    );
  }

  const leftSubnet = ipv6Subnet(leftAddress);
  const rightSubnet = ipv6Subnet(rightAddress);
  return !!leftSubnet && leftSubnet === rightSubnet;
}
