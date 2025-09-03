import React, { Component } from 'react';
import errorHandlingService from '../../services/errorHandling';
import ErrorMessage from './ErrorMessage';

/**
 * Error Boundary Component
 * 
 * This component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to our error handling service
    errorHandlingService.logError(error, {
      componentStack: errorInfo.componentStack,
      component: this.props.componentName || 'Unknown Component'
    });
    
    this.setState({ errorInfo });
    
    // Call the onError callback if provided
    if (this.props.onError && typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Call the onReset callback if provided
    if (this.props.onReset && typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      
      // Default fallback UI
      return (
        <div className="p-6 glass-effect rounded-xl">
          <ErrorMessage 
            error={this.state.error}
            severity={errorHandlingService.ErrorSeverity.ERROR}
            onRetry={this.handleReset}
          />
          
          {/* Show component stack in development */}
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 p-4 bg-white/5 rounded-lg">
              <summary className="text-sm text-white/70 cursor-pointer">Component Stack</summary>
              <pre className="mt-2 text-xs text-white/60 overflow-auto p-2">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;

