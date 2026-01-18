'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Optional text to display below the spinner
   */
  text?: string;
  
  /**
   * Optional detailed message
   */
  details?: string;
  
  /**
   * Whether to show in fullscreen mode
   * @default false
   */
  fullscreen?: boolean;
  
  /**
   * Custom className for the container
   */
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

/**
 * Loading spinner component with various sizes and optional text
 */
export function LoadingSpinner({
  size = 'md',
  text,
  details,
  fullscreen = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullscreen && 'min-h-screen',
        className
      )}
    >
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary')} />
      {text && (
        <div className="text-center">
          <p className="text-sm font-medium">{text}</p>
          {details && (
            <p className="text-xs text-muted-foreground mt-1">{details}</p>
          )}
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Inline loading indicator for buttons and small areas
 */
export function InlineLoader({ className }: { className?: string }) {
  return (
    <Loader2 className={cn('w-4 h-4 animate-spin', className)} />
  );
}

/**
 * Skeleton loader for text content
 */
export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-muted rounded animate-pulse',
            i === lines - 1 && 'w-3/4' // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for card content
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 space-y-4', className)}>
      <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
      <TextSkeleton lines={3} />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-muted rounded animate-pulse" />
        <div className="h-8 w-20 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Progress indicator with percentage
 */
export interface ProgressLoaderProps {
  progress: number; // 0-100
  text?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressLoader({
  progress,
  text,
  showPercentage = true,
  className,
}: ProgressLoaderProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('space-y-2', className)}>
      {(text || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {text && <span className="font-medium">{text}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Dots loading animation
 */
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
    </div>
  );
}

/**
 * Pulsing loader for subtle loading states
 */
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.2s]" />
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.4s]" />
    </div>
  );
}
