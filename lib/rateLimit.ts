/**
 * Rate Limiting Utility
 * Provides in-memory rate limiting for API endpoints
 * 
 * Note: For production with multiple server instances, consider using Redis
 * or a distributed rate limiting solution.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limiting
// In production, this should be replaced with Redis or similar
const ipRateLimitMap = new Map<string, RateLimitEntry>();
const emailRateLimitMap = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  // IP-based limits: 5 requests per 15 minutes
  IP_MAX_REQUESTS: 5,
  IP_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  
  // Email-based limits: 3 requests per hour
  EMAIL_MAX_REQUESTS: 3,
  EMAIL_WINDOW_MS: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Clean up expired entries periodically to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  
  // Clean IP entries
  for (const [ip, entry] of ipRateLimitMap.entries()) {
    if (now >= entry.resetTime) {
      ipRateLimitMap.delete(ip);
    }
  }
  
  // Clean email entries
  for (const [email, entry] of emailRateLimitMap.entries()) {
    if (now >= entry.resetTime) {
      emailRateLimitMap.delete(email);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Check if an IP address has exceeded rate limit
 * @param ip - IP address to check
 * @returns Object with allowed status and remaining requests
 */
export function checkIpRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  if (!entry || now >= entry.resetTime) {
    // No entry or expired, create new entry
    const resetTime = now + RATE_LIMIT_CONFIG.IP_WINDOW_MS;
    ipRateLimitMap.set(ip, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.IP_MAX_REQUESTS - 1,
      resetTime,
    };
  }

  if (entry.count >= RATE_LIMIT_CONFIG.IP_MAX_REQUESTS) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.IP_MAX_REQUESTS - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Check if an email address has exceeded rate limit
 * @param email - Email address to check
 * @returns Object with allowed status and remaining requests
 */
export function checkEmailRateLimit(email: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  const entry = emailRateLimitMap.get(normalizedEmail);

  if (!entry || now >= entry.resetTime) {
    // No entry or expired, create new entry
    const resetTime = now + RATE_LIMIT_CONFIG.EMAIL_WINDOW_MS;
    emailRateLimitMap.set(normalizedEmail, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.EMAIL_MAX_REQUESTS - 1,
      resetTime,
    };
  }

  if (entry.count >= RATE_LIMIT_CONFIG.EMAIL_MAX_REQUESTS) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.EMAIL_MAX_REQUESTS - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP address from Next.js request
 * @param request - Next.js request object
 * @returns IP address string
 */
export function getClientIp(request: Request): string {
  // Check various headers for IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  
  // Fallback to a default value (shouldn't happen in production)
  return "unknown";
}

