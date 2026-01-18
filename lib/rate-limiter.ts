/**
 * Rate limiting utilities to prevent API abuse and protect against excessive requests
 * Implements token bucket and sliding window algorithms
 */

export interface RateLimiterOptions {
  /**
   * Maximum number of requests allowed
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Message to show when rate limit is exceeded
   */
  message?: string;

  /**
   * Callback when rate limit is hit
   */
  onRateLimit?: (retryAfter: number) => void;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // Timestamp when limit resets
  retryAfter?: number; // Milliseconds until next request allowed
}

/**
 * Token bucket rate limiter
 * Allows burst requests up to maxRequests, then enforces rate
 */
export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per millisecond

  constructor(maxRequests: number, windowMs: number) {
    this.maxTokens = maxRequests;
    this.tokens = maxRequests;
    this.lastRefill = Date.now();
    this.refillRate = maxRequests / windowMs;
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Check if request is allowed and consume token if yes
   */
  tryConsume(): RateLimitResult {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return {
        allowed: true,
        remaining: Math.floor(this.tokens),
        reset: this.lastRefill + (this.maxTokens - this.tokens) / this.refillRate,
      };
    }

    const retryAfter = (1 - this.tokens) / this.refillRate;
    return {
      allowed: false,
      remaining: 0,
      reset: this.lastRefill + this.maxTokens / this.refillRate,
      retryAfter: Math.ceil(retryAfter),
    };
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }
}

/**
 * Sliding window rate limiter
 * More accurate than fixed window, prevents burst at window boundaries
 */
export class SlidingWindowRateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Remove old requests outside the current window
   */
  private cleanOldRequests(): void {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    this.requests = this.requests.filter((timestamp) => timestamp > cutoff);
  }

  /**
   * Check if request is allowed and record it if yes
   */
  tryConsume(): RateLimitResult {
    this.cleanOldRequests();
    const now = Date.now();

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return {
        allowed: true,
        remaining: this.maxRequests - this.requests.length,
        reset: this.requests[0] + this.windowMs,
      };
    }

    const oldestRequest = this.requests[0];
    const retryAfter = oldestRequest + this.windowMs - now;

    return {
      allowed: false,
      remaining: 0,
      reset: oldestRequest + this.windowMs,
      retryAfter: Math.ceil(retryAfter),
    };
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.requests = [];
  }
}

/**
 * Simple in-memory rate limiter with multiple keys
 * Useful for rate limiting different operations separately
 */
export class MultiKeyRateLimiter {
  private limiters = new Map<string, SlidingWindowRateLimiter>();
  private readonly defaultMaxRequests: number;
  private readonly defaultWindowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.defaultMaxRequests = maxRequests;
    this.defaultWindowMs = windowMs;
  }

  /**
   * Get or create rate limiter for a specific key
   */
  private getLimiter(key: string): SlidingWindowRateLimiter {
    if (!this.limiters.has(key)) {
      this.limiters.set(
        key,
        new SlidingWindowRateLimiter(this.defaultMaxRequests, this.defaultWindowMs)
      );
    }
    return this.limiters.get(key)!;
  }

  /**
   * Try to consume a token for the given key
   */
  tryConsume(key: string): RateLimitResult {
    return this.getLimiter(key).tryConsume();
  }

  /**
   * Reset rate limiter for a specific key
   */
  reset(key: string): void {
    this.limiters.delete(key);
  }

  /**
   * Reset all rate limiters
   */
  resetAll(): void {
    this.limiters.clear();
  }

  /**
   * Clean up old limiters that haven't been used recently
   */
  cleanup(inactiveMs: number = 3600000): void {
    // Default 1 hour
    const now = Date.now();
    for (const [key, limiter] of this.limiters.entries()) {
      // If no requests in the inactive period, remove the limiter
      limiter['requests'] = limiter['requests'].filter(
        (timestamp: number) => now - timestamp < inactiveMs
      );
      if (limiter['requests'].length === 0) {
        this.limiters.delete(key);
      }
    }
  }
}

/**
 * Rate limiter hook for React components
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const limiter = new TokenBucketRateLimiter(options.maxRequests, options.windowMs);

  return {
    /**
     * Check if action is allowed
     */
    checkLimit: (): RateLimitResult => {
      const result = limiter.tryConsume();

      if (!result.allowed && options.onRateLimit) {
        options.onRateLimit(result.retryAfter || 0);
      }

      return result;
    },

    /**
     * Wrap an async function with rate limiting
     */
    withRateLimit: async <T>(fn: () => Promise<T>): Promise<T> => {
      const result = limiter.tryConsume();

      if (!result.allowed) {
        const message =
          options.message || `Rate limit exceeded. Retry after ${Math.ceil((result.retryAfter || 0) / 1000)}s`;
        options.onRateLimit?.(result.retryAfter || 0);
        throw new Error(message);
      }

      return await fn();
    },

    /**
     * Reset the rate limiter
     */
    reset: () => limiter.reset(),
  };
}

/**
 * Global rate limiters for different operations
 */

// AI API calls - conservative limit to prevent abuse
export const aiApiRateLimiter = new MultiKeyRateLimiter(
  10, // 10 requests
  60000 // per minute
);

// Character generation - more restrictive
export const characterGenerationLimiter = new TokenBucketRateLimiter(
  3, // 3 requests
  300000 // per 5 minutes
);

// Script initialization - prevent spam
export const scriptInitLimiter = new TokenBucketRateLimiter(
  5, // 5 requests
  600000 // per 10 minutes
);

// Export/Copy actions - allow frequent but not excessive
export const exportLimiter = new TokenBucketRateLimiter(
  20, // 20 requests
  60000 // per minute
);

/**
 * Clean up old rate limiter data periodically
 * Call this in useEffect or similar
 */
export function startRateLimiterCleanup(intervalMs: number = 3600000): () => void {
  const interval = setInterval(() => {
    aiApiRateLimiter.cleanup();
  }, intervalMs);

  return () => clearInterval(interval);
}
