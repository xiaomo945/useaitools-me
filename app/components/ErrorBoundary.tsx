'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-gray-950">
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="text-7xl mb-6 animate-pulse">😵</div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Oops! Something went wrong
            </h1>

            {/* Error Description */}
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              We encountered an unexpected error while loading this page.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-8">
              Our team has been notified and is looking into it.
            </p>

            {/* Error ID for Support */}
            {this.state.errorId && (
              <div className="mb-6 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Error ID: <code className="font-mono text-emerald-600 dark:text-emerald-400">{this.state.errorId}</code>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95"
                aria-label="Try to reload the page"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all hover:scale-105 active:scale-95"
                aria-label="Go back to homepage"
              >
                Go Home
              </Link>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Or explore:</p>
              <div className="flex gap-4 justify-center text-sm">
                <Link href="/tools/1" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Browse Tools
                </Link>
                <Link href="/compare" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Compare Tools
                </Link>
                <Link href="/blog" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Read Blog
                </Link>
              </div>
            </div>

            {/* Developer Info (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left">
                <summary className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer mb-2">
                  Developer Error Details
                </summary>
                <pre className="text-xs text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
