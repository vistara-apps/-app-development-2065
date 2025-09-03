import React from 'react';
import { AlertCircle, AlertTriangle, Info, XCircle, RefreshCw } from 'lucide-react';
import errorHandlingService from '../../services/errorHandling';
import Button from '../ui/Button';

/**
 * Error Message Component
 * 
 * Displays a standardized error message with appropriate styling based on severity.
 */
const ErrorMessage = ({ 
  error, 
  severity = errorHandlingService.ErrorSeverity.ERROR,
  onRetry = null,
  className = '',
  showIcon = true
}) => {
  // Get user-friendly error message
  const message = typeof error === 'string' 
    ? error 
    : errorHandlingService.getUserFriendlyMessage(error);
  
  // Define styling based on severity
  const severityStyles = {
    [errorHandlingService.ErrorSeverity.INFO]: {
      containerClass: 'bg-blue-500/20 border-blue-500/30',
      textClass: 'text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-400" />
    },
    [errorHandlingService.ErrorSeverity.WARNING]: {
      containerClass: 'bg-yellow-500/20 border-yellow-500/30',
      textClass: 'text-yellow-200',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />
    },
    [errorHandlingService.ErrorSeverity.ERROR]: {
      containerClass: 'bg-red-500/20 border-red-500/30',
      textClass: 'text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-400" />
    },
    [errorHandlingService.ErrorSeverity.CRITICAL]: {
      containerClass: 'bg-red-600/20 border-red-600/30',
      textClass: 'text-red-200',
      icon: <XCircle className="w-5 h-5 text-red-400" />
    }
  };
  
  const { containerClass, textClass, icon } = severityStyles[severity] || severityStyles[errorHandlingService.ErrorSeverity.ERROR];
  
  return (
    <div className={`rounded-lg p-4 border ${containerClass} ${className}`}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="flex-shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        
        <div className="flex-1">
          <p className={`text-sm ${textClass}`}>
            {message}
          </p>
          
          {/* Show retry button if onRetry is provided */}
          {onRetry && typeof onRetry === 'function' && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;

