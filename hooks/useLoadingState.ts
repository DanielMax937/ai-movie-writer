import { useState, useCallback, useRef } from 'react';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  error?: string;
}

export interface LoadingStateManager {
  isLoading: boolean;
  message?: string;
  progress?: number;
  error?: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setMessage: (message: string) => void;
  setProgress: (progress: number) => void;
  setError: (error: string) => void;
  clearError: () => void;
  withLoading: <T>(fn: () => Promise<T>, message?: string) => Promise<T>;
}

/**
 * Hook for managing loading states with optional progress and error handling
 * 
 * @param initialMessage - Optional initial loading message
 * @returns LoadingStateManager object with state and control functions
 * 
 * @example
 * ```tsx
 * const loading = useLoadingState();
 * 
 * const handleSubmit = async () => {
 *   loading.startLoading('Saving data...');
 *   try {
 *     await saveData();
 *     loading.stopLoading();
 *   } catch (error) {
 *     loading.setError('Failed to save data');
 *   }
 * };
 * 
 * // Or use withLoading helper:
 * const handleSubmit = async () => {
 *   await loading.withLoading(saveData, 'Saving data...');
 * };
 * ```
 */
export function useLoadingState(initialMessage?: string): LoadingStateManager {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    message: initialMessage,
    progress: undefined,
    error: undefined,
  });

  const startLoading = useCallback((message?: string) => {
    setState({
      isLoading: true,
      message,
      progress: undefined,
      error: undefined,
    });
  }, []);

  const stopLoading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
    }));
  }, []);

  const setMessage = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      message,
    }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState((prev) => ({
      ...prev,
      progress: Math.min(Math.max(progress, 0), 100),
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: undefined,
    }));
  }, []);

  const withLoading = useCallback(
    async <T,>(fn: () => Promise<T>, message?: string): Promise<T> => {
      startLoading(message);
      try {
        const result = await fn();
        stopLoading();
        return result;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        throw error;
      }
    },
    [startLoading, stopLoading, setError]
  );

  return {
    isLoading: state.isLoading,
    message: state.message,
    progress: state.progress,
    error: state.error,
    startLoading,
    stopLoading,
    setMessage,
    setProgress,
    setError,
    clearError,
    withLoading,
  };
}

/**
 * Hook for managing multiple concurrent loading operations
 * Useful when you need to track different loading states independently
 * 
 * @example
 * ```tsx
 * const loading = useMultipleLoadingStates();
 * 
 * const handleLoad = async () => {
 *   loading.start('users', 'Loading users...');
 *   loading.start('posts', 'Loading posts...');
 *   
 *   await Promise.all([
 *     fetchUsers().finally(() => loading.stop('users')),
 *     fetchPosts().finally(() => loading.stop('posts')),
 *   ]);
 * };
 * 
 * return (
 *   <>
 *     {loading.isLoading('users') && <Spinner text="Loading users..." />}
 *     {loading.isLoading('posts') && <Spinner text="Loading posts..." />}
 *     {loading.isAnyLoading() && <GlobalSpinner />}
 *   </>
 * );
 * ```
 */
export function useMultipleLoadingStates() {
  const [states, setStates] = useState<Record<string, LoadingState>>({});

  const start = useCallback((key: string, message?: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: {
        isLoading: true,
        message,
        progress: undefined,
        error: undefined,
      },
    }));
  }, []);

  const stop = useCallback((key: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: false,
      },
    }));
  }, []);

  const setMessage = useCallback((key: string, message: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        message,
      },
    }));
  }, []);

  const setProgress = useCallback((key: string, progress: number) => {
    setStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        progress: Math.min(Math.max(progress, 0), 100),
      },
    }));
  }, []);

  const setError = useCallback((key: string, error: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        error,
        isLoading: false,
      },
    }));
  }, []);

  const clear = useCallback((key: string) => {
    setStates((prev) => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const clearAll = useCallback(() => {
    setStates({});
  }, []);

  const isLoading = useCallback(
    (key: string) => states[key]?.isLoading ?? false,
    [states]
  );

  const isAnyLoading = useCallback(() => {
    return Object.values(states).some((state) => state.isLoading);
  }, [states]);

  const getMessage = useCallback(
    (key: string) => states[key]?.message,
    [states]
  );

  const getProgress = useCallback(
    (key: string) => states[key]?.progress,
    [states]
  );

  const getError = useCallback(
    (key: string) => states[key]?.error,
    [states]
  );

  return {
    start,
    stop,
    setMessage,
    setProgress,
    setError,
    clear,
    clearAll,
    isLoading,
    isAnyLoading,
    getMessage,
    getProgress,
    getError,
    states,
  };
}

/**
 * Hook for managing loading state with automatic timeout
 * Useful for operations that should timeout after a certain duration
 * 
 * @param timeoutMs - Timeout duration in milliseconds
 * @param onTimeout - Optional callback when timeout occurs
 * 
 * @example
 * ```tsx
 * const loading = useLoadingStateWithTimeout(30000, () => {
 *   alert('Operation timed out');
 * });
 * 
 * const handleSubmit = async () => {
 *   loading.startLoading('Submitting...');
 *   try {
 *     await submitForm();
 *   } finally {
 *     loading.stopLoading();
 *   }
 * };
 * ```
 */
export function useLoadingStateWithTimeout(
  timeoutMs: number,
  onTimeout?: () => void
): LoadingStateManager {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const baseLoading = useLoadingState();

  const startLoading = useCallback(
    (message?: string) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Start loading
      baseLoading.startLoading(message);

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        baseLoading.setError('Operation timed out');
        onTimeout?.();
      }, timeoutMs);
    },
    [baseLoading, timeoutMs, onTimeout]
  );

  const stopLoading = useCallback(() => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    baseLoading.stopLoading();
  }, [baseLoading]);

  // Cleanup on unmount
  useCallback(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...baseLoading,
    startLoading,
    stopLoading,
  };
}
