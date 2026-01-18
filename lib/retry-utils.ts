/**
 * Retry utilities with exponential backoff for API calls
 * Provides resilient error handling for transient failures
 */

export interface RetryOptions {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Initial delay in milliseconds before first retry
   * @default 1000
   */
  initialDelay?: number;

  /**
   * Maximum delay in milliseconds between retries
   * @default 30000 (30 seconds)
   */
  maxDelay?: number;

  /**
   * Backoff multiplier for exponential backoff
   * @default 2
   */
  backoffMultiplier?: number;

  /**
   * Add random jitter to delays to prevent thundering herd
   * @default true
   */
  useJitter?: boolean;

  /**
   * Function to determine if an error is retryable
   * @default Retries on network errors and 5xx status codes
   */
  shouldRetry?: (error: Error, attempt: number) => boolean;

  /**
   * Callback called before each retry attempt
   */
  onRetry?: (error: Error, attempt: number, delayMs: number) => void;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
}

/**
 * Default retry predicate - retries on network errors and 5xx status codes
 */
function defaultShouldRetry(error: Error, attempt: number): boolean {
  // Don't retry after max attempts
  if (attempt >= 3) {
    return false;
  }

  const errorMessage = error.message.toLowerCase();

  // Retry on network errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('econnreset') ||
    errorMessage.includes('econnrefused') ||
    errorMessage.includes('fetch failed')
  ) {
    return true;
  }

  // Check for HTTP status codes in error message
  const statusMatch = errorMessage.match(/status[:\s]+(\d+)/i);
  if (statusMatch) {
    const status = parseInt(statusMatch[1], 10);
    // Retry on 5xx server errors and 429 rate limit
    return status >= 500 || status === 429;
  }

  // Check for rate limit errors
  if (
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests') ||
    errorMessage.includes('quota exceeded')
  ) {
    return true;
  }

  // Don't retry on other errors (4xx client errors, etc.)
  return false;
}

/**
 * Calculate delay with exponential backoff and optional jitter
 */
function calculateDelay(
  attempt: number,
  options: Required<RetryOptions>
): number {
  const exponentialDelay =
    options.initialDelay * Math.pow(options.backoffMultiplier, attempt);

  const cappedDelay = Math.min(exponentialDelay, options.maxDelay);

  if (options.useJitter) {
    // Add random jitter: ±25% of the delay
    const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);
    return Math.max(0, cappedDelay + jitter);
  }

  return cappedDelay;
}

/**
 * Execute a function with retry logic and exponential backoff
 * 
 * @param fn - Async function to execute
 * @param options - Retry configuration options
 * @returns Promise that resolves with the function result or rejects after all retries
 * 
 * @example
 * ```typescript
 * const result = await withRetry(
 *   async () => fetch('https://api.example.com/data'),
 *   { maxRetries: 5, initialDelay: 2000 }
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts: Required<RetryOptions> = {
    maxRetries: options.maxRetries ?? 3,
    initialDelay: options.initialDelay ?? 1000,
    maxDelay: options.maxDelay ?? 30000,
    backoffMultiplier: options.backoffMultiplier ?? 2,
    useJitter: options.useJitter ?? true,
    shouldRetry: options.shouldRetry ?? defaultShouldRetry,
    onRetry: options.onRetry ?? (() => {}),
  };

  let lastError: Error | undefined;
  let attempt = 0;

  while (attempt <= opts.maxRetries) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      attempt++;

      // Check if we should retry
      const shouldRetry = opts.shouldRetry(lastError, attempt);

      if (!shouldRetry || attempt > opts.maxRetries) {
        throw lastError;
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt - 1, opts);
      
      // Call retry callback
      opts.onRetry(lastError, attempt, delay);

      // Log retry attempt
      console.warn(
        `Retry attempt ${attempt}/${opts.maxRetries} after ${Math.round(delay)}ms`,
        { error: lastError.message }
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Retry failed with unknown error');
}

/**
 * Execute a function with retry logic and return detailed result
 * Does not throw on failure - returns success/error in result object
 * 
 * @param fn - Async function to execute
 * @param options - Retry configuration options
 * @returns Promise that resolves with detailed retry result
 * 
 * @example
 * ```typescript
 * const result = await withRetryResult(
 *   async () => fetch('https://api.example.com/data')
 * );
 * 
 * if (result.success) {
 *   console.log('Data:', result.data);
 * } else {
 *   console.error('Failed after', result.attempts, 'attempts:', result.error);
 * }
 * ```
 */
export async function withRetryResult<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const startTime = Date.now();
  let attempts = 0;

  try {
    const data = await withRetry(
      async () => {
        attempts++;
        return await fn();
      },
      options
    );

    return {
      success: true,
      data,
      attempts,
      totalTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      attempts,
      totalTime: Date.now() - startTime,
    };
  }
}

/**
 * Create a retry wrapper function with preset options
 * Useful for creating domain-specific retry functions
 * 
 * @param options - Default retry options
 * @returns Function that wraps other functions with retry logic
 * 
 * @example
 * ```typescript
 * const retryWithAIConfig = createRetryWrapper({
 *   maxRetries: 5,
 *   initialDelay: 2000,
 *   onRetry: (error, attempt) => {
 *     console.log(`AI API retry ${attempt}:`, error.message);
 *   }
 * });
 * 
 * const result = await retryWithAIConfig(() => generateText(...));
 * ```
 */
export function createRetryWrapper(defaultOptions: RetryOptions) {
  return async function retry<T>(
    fn: () => Promise<T>,
    overrideOptions?: RetryOptions
  ): Promise<T> {
    return withRetry(fn, { ...defaultOptions, ...overrideOptions });
  };
}

/**
 * Preset retry configuration for AI API calls
 * More aggressive retries with longer delays
 */
export const aiApiRetry = createRetryWrapper({
  maxRetries: 5,
  initialDelay: 2000,
  maxDelay: 60000, // 1 minute max
  backoffMultiplier: 2,
  useJitter: true,
  onRetry: (error, attempt, delayMs) => {
    console.log(
      `🔄 AI API retry ${attempt}/5 in ${Math.round(delayMs / 1000)}s`,
      `Error: ${error.message}`
    );
  },
});

/**
 * Preset retry configuration for standard network requests
 * Faster retries, fewer attempts
 */
export const networkRetry = createRetryWrapper({
  maxRetries: 3,
  initialDelay: 500,
  maxDelay: 10000,
  backoffMultiplier: 2,
  useJitter: true,
});
