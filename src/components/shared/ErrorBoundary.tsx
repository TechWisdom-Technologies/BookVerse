"use client";

import { Component, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center border border-dashed border-zinc-100 dark:border-zinc-900 bg-zinc-50/10 p-12 text-center rounded">
          <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded flex items-center justify-center mb-8">
            <AlertCircle className="w-6 h-6 text-zinc-300" />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 max-w-xs mb-10 italic">
            An unexpected error occurred. Please try refreshing the page or try again below.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-3 px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 transition-all border border-zinc-900 dark:border-white shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
