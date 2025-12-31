"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { AlertCircle, RefreshCw } from "@/components/atoms/Icon";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch and display errors gracefully
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-danger mb-4" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-text-secondary mb-4 max-w-md">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button onClick={this.handleReset} variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error state component for data loading errors
 */
export function ErrorState({
  message = "Failed to load data",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-10 w-10 text-danger mb-3" />
      <p className="text-sm text-text-secondary mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}
