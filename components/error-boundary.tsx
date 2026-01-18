'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching React errors in child components
 * Compatible with React 19+
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('Error Boundary caught error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // You could also send to error tracking service here
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">出现错误</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  应用程序遇到了一个错误。您可以尝试刷新页面或重新开始。
                </p>
                
                {process.env.NODE_ENV === 'development' && (
                  <details className="mb-4 p-3 bg-muted rounded text-xs">
                    <summary className="cursor-pointer font-medium mb-2">
                      错误详情 (仅开发环境可见)
                    </summary>
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.error.message}
                      {'\n\n'}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={this.resetError}
                    variant="default"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重试
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="sm"
                  >
                    刷新页面
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap any component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: (error: Error, resetError: () => void) => ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
