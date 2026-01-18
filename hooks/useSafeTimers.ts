import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for safely managing timeouts that automatically cleanup on unmount
 * Prevents memory leaks from lingering timeouts
 */
export function useSafeTimeout() {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const clearTimeout = useCallback((timeout: NodeJS.Timeout) => {
    global.clearTimeout(timeout);
    timeoutsRef.current.delete(timeout);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => global.clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const setTimeout = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const timeout = global.setTimeout(() => {
      // Remove from tracked timeouts after execution
      timeoutsRef.current.delete(timeout);
      callback();
    }, delay);

    // Track this timeout
    timeoutsRef.current.add(timeout);

    return timeout;
  }, []);

  return { setTimeout, clearTimeout, clearAllTimeouts };
}

/**
 * Hook for safely managing intervals that automatically cleanup on unmount
 * Prevents memory leaks from lingering intervals
 */
export function useSafeInterval() {
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const clearInterval = useCallback((interval: NodeJS.Timeout) => {
    global.clearInterval(interval);
    intervalsRef.current.delete(interval);
  }, []);

  const clearAllIntervals = useCallback(() => {
    intervalsRef.current.forEach((interval) => global.clearInterval(interval));
    intervalsRef.current.clear();
  }, []);

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      clearAllIntervals();
    };
  }, [clearAllIntervals]);

  const setInterval = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const interval = global.setInterval(callback, delay);

    // Track this interval
    intervalsRef.current.add(interval);

    return interval;
  }, []);

  return { setInterval, clearInterval, clearAllIntervals };
}

/**
 * Hook for managing both timeouts and intervals with automatic cleanup
 */
export function useSafeTimers() {
  const timeout = useSafeTimeout();
  const interval = useSafeInterval();

  const clearAll = useCallback(() => {
    timeout.clearAllTimeouts();
    interval.clearAllIntervals();
  }, [timeout, interval]);

  return {
    setTimeout: timeout.setTimeout,
    clearTimeout: timeout.clearTimeout,
    setInterval: interval.setInterval,
    clearInterval: interval.clearInterval,
    clearAll,
  };
}

/**
 * Hook for debouncing a value with automatic cleanup
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // This only runs after user stops typing for 500ms
 *   performSearch(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const { setTimeout, clearTimeout } = useSafeTimeout();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function automatically called by useSafeTimeout
  }, [value, delay, setTimeout, clearTimeout]);

  return debouncedValue;
}

/**
 * Hook for throttling a function with automatic cleanup
 * 
 * @param callback - Function to throttle
 * @param delay - Minimum time between calls in milliseconds
 * @returns Throttled function
 * 
 * @example
 * ```tsx
 * const handleScroll = useThrottle(() => {
 *   console.log('Scrolled!');
 * }, 100);
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 * ```
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const { setTimeout, clearTimeout } = useSafeTimeout();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastRunRef = useRef<number>(0);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        // Execute immediately if enough time has passed
        callback(...args);
        lastRunRef.current = now;
      } else {
        // Schedule execution after remaining time
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRunRef.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    },
    [callback, delay, setTimeout, clearTimeout]
  );

  return throttledFn as T;
}

/**
 * Hook for delaying execution until a condition is met, with automatic cleanup
 * 
 * @param callback - Function to execute
 * @param condition - Condition that must be true to execute
 * @param delay - Delay before checking condition again
 * 
 * @example
 * ```tsx
 * useWaitFor(
 *   () => console.log('Data loaded!'),
 *   () => data !== null,
 *   100 // Check every 100ms
 * );
 * ```
 */
export function useWaitFor(
  callback: () => void,
  condition: () => boolean,
  delay: number = 100
) {
  const { setTimeout } = useSafeTimeout();

  useEffect(() => {
    const check = () => {
      if (condition()) {
        callback();
      } else {
        setTimeout(check, delay);
      }
    };

    check();
  }, [callback, condition, delay, setTimeout]);
}

