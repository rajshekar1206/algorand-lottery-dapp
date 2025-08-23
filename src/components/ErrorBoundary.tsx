import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-4">
              The application encountered an error. This might be due to:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mb-6">
              <li>Backend server not running</li>
              <li>Network connection issues</li>
              <li>Configuration problems</li>
            </ul>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <div className="mt-4 text-center">
              <button
                onClick={() => window.location.reload()}
                className="text-gray-400 hover:text-gray-300 text-sm"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
