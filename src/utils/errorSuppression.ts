// Utility to suppress console errors for known network issues

let originalConsoleError: typeof console.error;

export const suppressNetworkErrors = () => {
  if (originalConsoleError) return; // Already suppressed
  
  originalConsoleError = console.error;
  
  console.error = (...args: any[]) => {
    const message = args[0];
    
    // Suppress common network/fetch errors
    if (typeof message === 'string') {
      const suppressedPatterns = [
        'Failed to fetch',
        'fetch',
        'Network request failed',
        'ERR_NETWORK',
        'ERR_INTERNET_DISCONNECTED',
        'TypeError: NetworkError',
        'AbortError',
        'Cannot mix BigInt and other types',
        'BigInt'
      ];
      
      const shouldSuppress = suppressedPatterns.some(pattern => 
        message.includes(pattern)
      );
      
      if (shouldSuppress) {
        return; // Don't log this error
      }
    }
    
    // Log all other errors normally
    originalConsoleError.apply(console, args);
  };
};

export const restoreConsoleError = () => {
  if (originalConsoleError) {
    console.error = originalConsoleError;
    originalConsoleError = undefined as any;
  }
};

// Auto-suppress network errors in development
if (import.meta.env.DEV) {
  suppressNetworkErrors();
}
