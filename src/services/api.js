/**
 * API Service
 * 
 * This module provides functions for making API requests.
 * It handles authentication, error handling, and request formatting.
 */

import authService from './auth';
import errorHandlingService from './errorHandling';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.pixelperfect.ai';

/**
 * Make an API request
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<any>} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add authentication token if available
    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Prepare request options
    const requestOptions = {
      method: options.method || 'GET',
      headers,
      ...options
    };
    
    // Add body if provided
    if (options.body && headers['Content-Type'] === 'application/json') {
      requestOptions.body = JSON.stringify(options.body);
    } else if (options.body) {
      requestOptions.body = options.body;
    }
    
    // Make the request
    const response = await fetch(url, requestOptions);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || data.error || 'API request failed',
          data
        };
      }
      
      return data;
    } else {
      // Handle non-JSON responses (like file downloads)
      if (!response.ok) {
        const text = await response.text();
        throw {
          status: response.status,
          message: text || 'API request failed'
        };
      }
      
      return response;
    }
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw errorHandlingService.handleNetworkError(
        new Error('Network error. Please check your internet connection.')
      );
    }
    
    // Handle API errors
    throw errorHandlingService.handleApiError(error);
  }
};

/**
 * Upload a file to the API
 * 
 * @param {string} endpoint - API endpoint
 * @param {File|Blob} file - File to upload
 * @param {Object} metadata - Additional metadata
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<any>} - Response data
 */
export const uploadFile = async (endpoint, file, metadata = {}, onProgress = null) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Get authentication token
    const token = authService.getToken();
    
    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      if (onProgress && typeof onProgress === 'function') {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
      }
      
      // Handle response
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject({
              status: xhr.status,
              message: errorData.message || errorData.error || 'Upload failed',
              data: errorData
            });
          } catch (e) {
            reject({
              status: xhr.status,
              message: 'Upload failed'
            });
          }
        }
      };
      
      // Handle network errors
      xhr.onerror = () => {
        reject(errorHandlingService.handleNetworkError(
          new Error('Network error. Please check your internet connection.')
        ));
      };
      
      // Open and send the request
      xhr.open('POST', url);
      
      // Add authentication header
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  } catch (error) {
    throw errorHandlingService.handleUploadError(error);
  }
};

export default {
  apiRequest,
  uploadFile
};

