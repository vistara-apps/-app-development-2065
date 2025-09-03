/**
 * Authentication Service
 * 
 * This module provides functions for user authentication and profile management.
 * It handles login, registration, profile updates, and password management.
 */

import { apiRequest } from './api';

// Token storage keys
const TOKEN_KEY = 'pixelperfect_token';
const USER_KEY = 'pixelperfect_user';

/**
 * Get the current user from local storage
 * 
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = async () => {
  try {
    // Check if we have a token
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    
    // Try to get user data from local storage first
    const userData = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    
    // If we have user data and it's not expired, return it
    if (userData && userData.expiresAt && new Date(userData.expiresAt) > new Date()) {
      return userData;
    }
    
    // Otherwise, fetch fresh user data from the API
    const freshUserData = await apiRequest('/auth/me');
    
    // Save the fresh user data
    saveUserData(freshUserData);
    
    return freshUserData;
  } catch (error) {
    // If there's an error, clear the token and user data
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

/**
 * Save user data to local storage
 * 
 * @param {Object} userData - User data to save
 */
const saveUserData = (userData) => {
  if (!userData) return;
  
  // Add expiration time (24 hours)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  const dataToSave = {
    ...userData,
    expiresAt: expiresAt.toISOString()
  };
  
  localStorage.setItem(USER_KEY, JSON.stringify(dataToSave));
};

/**
 * Save authentication token to local storage
 * 
 * @param {string} token - Authentication token
 */
const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get authentication token from local storage
 * 
 * @returns {string|null} - Authentication token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Clear authentication data from local storage
 */
const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Login user
 * 
 * @param {Object} credentials - Login credentials (email, password)
 * @returns {Promise<Object>} - User data
 */
export const login = async (credentials) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: credentials
    });
    
    saveToken(response.token);
    saveUserData(response.user);
    
    return response.user;
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Register new user
 * 
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - User data
 */
export const register = async (userData) => {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    });
    
    saveToken(response.token);
    saveUserData(response.user);
    
    return response.user;
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Logout user
 * 
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST'
    });
  } catch (error) {
    console.error('Logout Error:', error);
  } finally {
    clearAuth();
  }
};

/**
 * Update user profile
 * 
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: profileData
    });
    
    saveUserData(response);
    
    return response;
  } catch (error) {
    console.error('Update Profile Error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Reset password
 * 
 * @param {string} email - User email
 * @returns {Promise<Object>} - Response data
 */
export const resetPassword = async (email) => {
  try {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { email }
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    throw new Error(error.message || 'Failed to reset password');
  }
};

/**
 * Change password
 * 
 * @param {Object} passwords - Password data (currentPassword, newPassword)
 * @returns {Promise<Object>} - Response data
 */
export const changePassword = async (passwords) => {
  try {
    return await apiRequest('/auth/change-password', {
      method: 'POST',
      body: passwords
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    throw new Error(error.message || 'Failed to change password');
  }
};

/**
 * Verify email
 * 
 * @param {string} token - Verification token
 * @returns {Promise<Object>} - Response data
 */
export const verifyEmail = async (token) => {
  try {
    return await apiRequest(`/auth/verify-email/${token}`);
  } catch (error) {
    console.error('Verify Email Error:', error);
    throw new Error(error.message || 'Failed to verify email');
  }
};

/**
 * Get user activity
 * 
 * @returns {Promise<Object>} - User activity data
 */
export const getUserActivity = async () => {
  try {
    return await apiRequest('/auth/activity');
  } catch (error) {
    console.error('Get User Activity Error:', error);
    throw new Error(error.message || 'Failed to get user activity');
  }
};

// For development/demo purposes
export const createMockUser = (userData = {}) => {
  return {
    id: 'mock-user-id',
    name: 'Demo User',
    email: 'demo@example.com',
    subscriptionTier: userData.subscriptionTier || 'free',
    editsRemaining: userData.editsRemaining || 3,
    ...userData
  };
};

export default {
  getCurrentUser,
  getToken,
  login,
  register,
  logout,
  updateProfile,
  resetPassword,
  changePassword,
  verifyEmail,
  getUserActivity,
  createMockUser
};

