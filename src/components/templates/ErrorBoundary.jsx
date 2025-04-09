import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-[#1F1E24] text-white flex flex-col items-center justify-center p-4">
          <div className="bg-[#2D2B37] p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
            <p className="text-zinc-300 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="ml-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Go Home
            </button>
            {this.state.error && (
              <details className="mt-4 p-2 bg-zinc-800 rounded text-xs">
                <summary className="cursor-pointer text-zinc-400">Error Details</summary>
                <pre className="mt-2 text-red-400 overflow-auto p-2">
                  {this.state.error.toString()}
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
