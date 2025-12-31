"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/atoms/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Reset key - when this changes, the error boundary resets */
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Enhanced Error Boundary with retry, reporting, and custom fallback
 */
export class ErrorBoundaryEnhanced extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when resetKey changes
    if (
      this.state.hasError &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
function ErrorFallback({
  error,
  errorInfo,
  onRetry,
}: {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onRetry: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center bg-bg-secondary rounded-lg border border-border-primary">
      {/* Error Icon */}
      <div className="w-12 h-12 mb-4 rounded-full bg-error/10 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* Error Message */}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-text-secondary mb-4 max-w-md">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>

      {/* Dev-only: Stack trace */}
      {isDev && errorInfo && (
        <details className="w-full max-w-lg mb-4 text-left">
          <summary className="text-xs text-text-tertiary cursor-pointer hover:text-text-secondary">
            View stack trace
          </summary>
          <pre className="mt-2 p-3 text-xs bg-bg-tertiary rounded overflow-auto max-h-40 text-text-secondary">
            {errorInfo.componentStack}
          </pre>
        </details>
      )}

      {/* Retry Button */}
      <Button onClick={onRetry} variant="secondary" size="sm">
        Try Again
      </Button>
    </div>
  );
}

/**
 * Inline error display for smaller components
 */
export function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 p-3 bg-error/10 rounded-lg border border-error/20">
      <svg
        className="w-4 h-4 text-error flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-sm text-error flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-error hover:underline font-medium"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Warning banner for non-critical errors
 */
export function WarningBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
      <svg
        className="w-4 h-4 text-warning flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span className="text-sm text-warning flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-warning hover:text-warning/80"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
