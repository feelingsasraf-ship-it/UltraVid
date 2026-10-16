import dns from 'node:dns/promises';
import { Request, Response, NextFunction } from 'express';

export class SecurityError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'SecurityError';
    this.statusCode = statusCode;
  }
}

/**
 * Checks whether an IPv4 address is within private, loopback, or reserved IP ranges.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return true;

  // 0.0.0.0/8
  if (parts[0] === 0) return true;
  // 10.0.0.0/8 (Private)
  if (parts[0] === 10) return true;
  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
  // 169.254.0.0/16 (Link Local / Cloud Metadata)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 172.16.0.0/12 (Private)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (TEST-NET)
  if (parts[0] === 192 && parts[1] === 0 && parts[2] === 2) return true;
  if (parts[0] === 198 && parts[1] === 51 && parts[2] === 100) return true;
  if (parts[0] === 203 && parts[1] === 0 && parts[2] === 113) return true;
  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (parts[0] >= 224) return true;

  return false;
}

/**
 * Checks whether an IPv6 address is private or loopback.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  if (normalized.startsWith('fe80:')) return true; // Link-local
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // Unique local
  if (normalized.startsWith('::ffff:')) {
    const ipv4 = normalized.replace('::ffff:', '');
    return isPrivateIPv4(ipv4);
  }
  return false;
}

/**
 * Validates a target URL against SSRF threats and ensures standard web protocol.
 */
export async function validateSafeUrl(rawUrl: string): Promise<URL> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new SecurityError('Video URL must be provided and must be a valid string.', 400);
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > 2048) {
    throw new SecurityError('URL exceeds safe length limit (max 2048 characters).', 400);
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new SecurityError('Invalid URL structure. Please enter a complete link starting with https:// or http://', 400);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new SecurityError(`Unsupported protocol: ${parsed.protocol}. Only HTTP and HTTPS are permitted.`, 400);
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost, link-local metadata names, and explicit reserved hostnames
  const forbiddenHosts = [
    'localhost',
    '127.0.0.1',
    '::1',
    'metadata.google.internal',
    '169.254.169.254',
    'instance-data',
  ];
  if (forbiddenHosts.includes(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw new SecurityError('SSRF Protection: Access to private networks, loopback, or metadata services is blocked.', 403);
  }

  // Resolve hostname via DNS to verify IP is public
  try {
    const lookupResult = await dns.lookup(hostname, { all: true });
    if (!lookupResult || lookupResult.length === 0) {
      throw new SecurityError(`Could not resolve domain: ${hostname}`, 400);
    }

    for (const record of lookupResult) {
      if (record.family === 4 && isPrivateIPv4(record.address)) {
        throw new SecurityError(`SSRF Protection: Hostname resolves to private IP (${record.address}). Access denied.`, 403);
      }
      if (record.family === 6 && isPrivateIPv6(record.address)) {
        throw new SecurityError(`SSRF Protection: Hostname resolves to reserved IPv6 (${record.address}). Access denied.`, 403);
      }
    }
  } catch (err: any) {
    if (err instanceof SecurityError) throw err;
    throw new SecurityError(`DNS lookup failed for ${hostname}: ${err.message || 'Unknown network error'}`, 400);
  }

  return parsed;
}

/**
 * Sanitizes file names to prevent directory traversal and header injection.
 */
export function sanitizeFilename(filename: string, fallback = 'ultravid_download'): string {
  if (!filename) return fallback;
  // Remove path traversal and forbidden characters
  let clean = filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\.\.+/g, '.')
    .trim();

  if (clean.length > 120) {
    clean = clean.substring(0, 120);
  }
  return clean || fallback;
}

/**
 * Simple in-memory sliding window rate limiter
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale rate limit entries every 5 minutes
const rateLimitCleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (record.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);
rateLimitCleanup.unref();

export function createRateLimiter(options: { maxRequests: number; windowMs: number }) {
  const { maxRequests, windowMs } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';

    const now = Date.now();
    let record = rateLimitMap.get(clientIp);

    if (!record || record.resetAt <= now) {
      record = { count: 1, resetAt: now + windowMs };
      rateLimitMap.set(clientIp, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000).toString());

    if (record.count > maxRequests) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please wait ${Math.ceil((record.resetAt - now) / 1000)} seconds before trying again.`,
        retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
      });
      return;
    }

    next();
  };
}
