/**
 * Social Sharing Service
 * 
 * This module provides functions for sharing images to social media platforms.
 * It handles direct sharing to platforms like Instagram, Twitter, and Facebook.
 */

import { apiRequest } from './api';

/**
 * Share an image to Instagram
 * 
 * @param {string} imageUrl - URL of the image to share
 * @param {string} caption - Caption for the image
 * @param {Object} options - Additional sharing options
 * @returns {Promise<Object>} - Sharing response
 */
export const shareToInstagram = async (imageUrl, caption = '', options = {}) => {
  try {
    return await apiRequest('/social/share/instagram', {
      method: 'POST',
      body: {
        imageUrl,
        caption,
        ...options
      }
    });
  } catch (error) {
    console.error('Instagram Sharing Error:', error);
    throw new Error(`Failed to share to Instagram: ${error.message}`);
  }
};

/**
 * Share an image to Twitter
 * 
 * @param {string} imageUrl - URL of the image to share
 * @param {string} text - Tweet text
 * @param {Object} options - Additional sharing options
 * @returns {Promise<Object>} - Sharing response
 */
export const shareToTwitter = async (imageUrl, text = '', options = {}) => {
  try {
    return await apiRequest('/social/share/twitter', {
      method: 'POST',
      body: {
        imageUrl,
        text,
        ...options
      }
    });
  } catch (error) {
    console.error('Twitter Sharing Error:', error);
    throw new Error(`Failed to share to Twitter: ${error.message}`);
  }
};

/**
 * Share an image to Facebook
 * 
 * @param {string} imageUrl - URL of the image to share
 * @param {string} message - Post message
 * @param {Object} options - Additional sharing options
 * @returns {Promise<Object>} - Sharing response
 */
export const shareToFacebook = async (imageUrl, message = '', options = {}) => {
  try {
    return await apiRequest('/social/share/facebook', {
      method: 'POST',
      body: {
        imageUrl,
        message,
        ...options
      }
    });
  } catch (error) {
    console.error('Facebook Sharing Error:', error);
    throw new Error(`Failed to share to Facebook: ${error.message}`);
  }
};

/**
 * Share an image to Pinterest
 * 
 * @param {string} imageUrl - URL of the image to share
 * @param {string} description - Pin description
 * @param {string} link - URL to link to
 * @param {Object} options - Additional sharing options
 * @returns {Promise<Object>} - Sharing response
 */
export const shareToPinterest = async (imageUrl, description = '', link = '', options = {}) => {
  try {
    return await apiRequest('/social/share/pinterest', {
      method: 'POST',
      body: {
        imageUrl,
        description,
        link,
        ...options
      }
    });
  } catch (error) {
    console.error('Pinterest Sharing Error:', error);
    throw new Error(`Failed to share to Pinterest: ${error.message}`);
  }
};

/**
 * Get connected social accounts
 * 
 * @returns {Promise<Array<Object>>} - List of connected social accounts
 */
export const getConnectedAccounts = async () => {
  try {
    return await apiRequest('/social/accounts');
  } catch (error) {
    console.error('Get Connected Accounts Error:', error);
    throw new Error(`Failed to get connected accounts: ${error.message}`);
  }
};

/**
 * Connect a social media account
 * 
 * @param {string} platform - Social media platform
 * @returns {Promise<Object>} - Connection response with auth URL
 */
export const connectAccount = async (platform) => {
  try {
    return await apiRequest(`/social/connect/${platform}`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Connect Account Error:', error);
    throw new Error(`Failed to connect ${platform} account: ${error.message}`);
  }
};

/**
 * Disconnect a social media account
 * 
 * @param {string} platform - Social media platform
 * @returns {Promise<Object>} - Disconnection confirmation
 */
export const disconnectAccount = async (platform) => {
  try {
    return await apiRequest(`/social/disconnect/${platform}`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Disconnect Account Error:', error);
    throw new Error(`Failed to disconnect ${platform} account: ${error.message}`);
  }
};

/**
 * Share to multiple platforms at once
 * 
 * @param {string} imageUrl - URL of the image to share
 * @param {Object} content - Content for each platform
 * @param {Array<string>} platforms - Platforms to share to
 * @returns {Promise<Object>} - Sharing response
 */
export const shareToMultiplePlatforms = async (imageUrl, content = {}, platforms = []) => {
  try {
    return await apiRequest('/social/share/multiple', {
      method: 'POST',
      body: {
        imageUrl,
        content,
        platforms
      }
    });
  } catch (error) {
    console.error('Multiple Platforms Sharing Error:', error);
    throw new Error(`Failed to share to multiple platforms: ${error.message}`);
  }
};

/**
 * Check if native sharing is available in the browser
 * 
 * @returns {boolean} - Whether native sharing is available
 */
export const isNativeSharingAvailable = () => {
  return !!navigator.share;
};

/**
 * Share using the browser's native sharing API
 * 
 * @param {Object} data - Share data (title, text, url, files)
 * @returns {Promise<void>} - Sharing result
 */
export const shareNative = async (data) => {
  if (!isNativeSharingAvailable()) {
    throw new Error('Native sharing is not available in this browser');
  }
  
  try {
    await navigator.share(data);
    return { success: true };
  } catch (error) {
    console.error('Native Sharing Error:', error);
    throw error;
  }
};

export default {
  shareToInstagram,
  shareToTwitter,
  shareToFacebook,
  shareToPinterest,
  getConnectedAccounts,
  connectAccount,
  disconnectAccount,
  shareToMultiplePlatforms,
  isNativeSharingAvailable,
  shareNative
};

