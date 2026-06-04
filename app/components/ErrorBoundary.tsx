'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-6xl mb-4">😵</h1>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            We&apos;re sorry, but there was an error loading this page.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Go Home
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left max-w-md">
              <pre className="text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">{this.state.error.stack}</pre>
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
