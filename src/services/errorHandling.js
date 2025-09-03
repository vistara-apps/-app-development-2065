/**
 * Error Handling Service
 * 
 * This module provides functions for handling and logging errors throughout the application.
 * It centralizes error handling logic and provides consistent error reporting.
 */

// Error types
export const ErrorTypes = {
  API: 'API_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NETWORK: 'NETWORK_ERROR',
  PAYMENT: 'PAYMENT_ERROR',
  UPLOAD: 'UPLOAD_ERROR',
  PROCESSING: 'PROCESSING_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ErrorSeverity = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

/**
 * Create a standardized error object
 * 
 * @param {string} message - Error message
 * @param {string} type - Error type from ErrorTypes
 * @param {string} severity - Error severity from ErrorSeverity
 * @param {Object} metadata - Additional error metadata
 * @returns {Object} - Standardized error object
 */
export const createError = (message, type = ErrorTypes.UNKNOWN, severity = ErrorSeverity.ERROR, metadata = {}) => {
  return {
    message,
    type,
    severity,
    timestamp: new Date().toISOString(),
    metadata
  };
};

/**
 * Log an error to the console and optionally to a monitoring service
 * 
 * @param {Error|Object} error - Error object
 * @param {Object} context - Error context information
 * @returns {void}
 */
export const logError = (error, context = {}) => {
  // Create standardized error object if not already
  const errorObj = error.type 
    ? error 
    : createError(
        error.message || 'An unknown error occurred',
        ErrorTypes.UNKNOWN,
        ErrorSeverity.ERROR,
        { originalError: error, ...context }
      );

  // Log to console
  console.error('Error:', errorObj);

  // In a real app, we would send this to a monitoring service like Sentry
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: { ...context, ...errorObj } });
  }
};

/**
 * Handle API errors
 * 
 * @param {Error} error - API error
 * @param {Object} context - Error context
 * @returns {Object} - Standardized error object
 */
export const handleApiError = (error, context = {}) => {
  // Extract status code if available
  const statusCode = error.response?.status || null;
  
  // Determine error type based on status code
  let type = ErrorTypes.API;
  let severity = ErrorSeverity.ERROR;
  
  if (statusCode) {
    if (statusCode === 401 || statusCode === 403) {
      type = ErrorTypes.AUTH;
    } else if (statusCode === 400 || statusCode === 422) {
      type = ErrorTypes.VALIDATION;
    } else if (statusCode >= 500) {
      severity = ErrorSeverity.CRITICAL;
    }
  }
  
  // Create standardized error
  const errorObj = createError(
    error.message || 'An API error occurred',
    type,
    severity,
    { 
      statusCode,
      originalError: error,
      ...context
    }
  );
  
  // Log the error
  logError(errorObj);
  
  return errorObj;
};

/**
 * Handle network errors
 * 
 * @param {Error} error - Network error
 * @param {Object} context - Error context
 * @returns {Object} - Standardized error object
 */
export const handleNetworkError = (error, context = {}) => {
  const errorObj = createError(
    error.message || 'A network error occurred. Please check your connection.',
    ErrorTypes.NETWORK,
    ErrorSeverity.WARNING,
    { originalError: error, ...context }
  );
  
  logError(errorObj);
  
  return errorObj;
};

/**
 * Handle authentication errors
 * 
 * @param {Error} error - Auth error
 * @param {Object} context - Error context
 * @returns {Object} - Standardized error object
 */
export const handleAuthError = (error, context = {}) => {
  const errorObj = createError(
    error.message || 'An authentication error occurred',
    ErrorTypes.AUTH,
    ErrorSeverity.WARNING,
    { originalError: error, ...context }
  );
  
  logError(errorObj);
  
  return errorObj;
};

/**
 * Handle validation errors
 * 
 * @param {Error|Object} error - Validation error
 * @param {Object} context - Error context
 * @returns {Object} - Standardized error object
 */
export const handleValidationError = (error, context = {}) => {
  // Extract validation details if available
  const validationErrors = error.errors || error.details || {};
  
  const errorObj = createError(
    error.message || 'Validation failed. Please check your input.',
    ErrorTypes.VALIDATION,
    ErrorSeverity.INFO,
    { validationErrors, originalError: error, ...context }
  );
  
  logError(errorObj);
  
  return errorObj;
};

/**
 * Handle payment processing errors
 * 
 * @param {Error} error - Payment error
 * @param {Object} context - Error context
 * @returns {Object} - Standardized error object
 */
export const handlePaymentError = (error, context = {}) => {
  const errorObj = createError(
    error.message || 'A payment processing error occurred',
    ErrorTypes.PAYMENT,
    ErrorSeverity.ERROR,
    { originalError: error, ...context }
  );
  
  logError(errorObj);
  
  return errorObj;
};

/**
 * Handle file upload errors
 * 
 * @param {Error} error - Upload error
 * @param {Object} context - Error context
 * @returns {Object} - Standardized error object
 */
export const handleUploadError = (error, context = {}) => {
  const errorObj = createError(
    error.message || 'An error occurred while uploading your file',
    ErrorTypes.UPLOAD,
    ErrorSeverity.WARNING,
    { originalError: error, ...context }
  );
  
  logError(errorObj);
  
  return errorObj;
};

/**
 * Handle image processing errors
 * 
 * @param {Error} error - Processing error
 * @param {Object} context - Error context
 * @returns {Object} - Standardized error object
 */
export const handleProcessingError = (error, context = {}) => {
  const errorObj = createError(
    error.message || 'An error occurred while processing your image',
    ErrorTypes.PROCESSING,
    ErrorSeverity.ERROR,
    { originalError: error, ...context }
  );
  
  logError(errorObj);
  
  return errorObj;
};

/**
 * Get a user-friendly error message
 * 
 * @param {Object} error - Standardized error object
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  // Default messages by error type
  const defaultMessages = {
    [ErrorTypes.API]: 'We encountered an issue with our service. Please try again later.',
    [ErrorTypes.AUTH]: 'Authentication failed. Please sign in again.',
    [ErrorTypes.VALIDATION]: 'Please check your input and try again.',
    [ErrorTypes.NETWORK]: 'Network connection issue. Please check your internet connection.',
    [ErrorTypes.PAYMENT]: 'Payment processing failed. Please try again or use a different payment method.',
    [ErrorTypes.UPLOAD]: 'File upload failed. Please try again with a smaller file or check your connection.',
    [ErrorTypes.PROCESSING]: 'Image processing failed. Please try again with a different image.',
    [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again later.'
  };
  
  // Use the error message if it's user-friendly, otherwise use the default message
  return error.message || defaultMessages[error.type] || defaultMessages[ErrorTypes.UNKNOWN];
};

export default {
  ErrorTypes,
  ErrorSeverity,
  createError,
  logError,
  handleApiError,
  handleNetworkError,
  handleAuthError,
  handleValidationError,
  handlePaymentError,
  handleUploadError,
  handleProcessingError,
  getUserFriendlyMessage
};

