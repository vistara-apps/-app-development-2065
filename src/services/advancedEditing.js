/**
 * Advanced Editing Service
 * 
 * This module provides functions for advanced image editing operations.
 * It handles AI upscaling, smart cropping, object removal, and other advanced features.
 */

import { apiRequest, uploadFile } from './api';

/**
 * Upscale an image using AI
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Object} options - Upscaling options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const upscaleImage = async (imageFile, options = {}, onProgress = null) => {
  try {
    const metadata = {
      scale: options.scale || 2, // 2x, 4x, etc.
      model: options.model || 'standard',
      format: options.format || 'jpeg',
      ...options
    };

    return await uploadFile('/image/advanced/upscale', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Image Upscaling Error:', error);
    throw new Error(`Failed to upscale image: ${error.message}`);
  }
};

/**
 * Smart crop an image
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Object} options - Cropping options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const smartCrop = async (imageFile, options = {}, onProgress = null) => {
  try {
    const metadata = {
      width: options.width || 1024,
      height: options.height || 1024,
      focusOn: options.focusOn || 'auto', // 'face', 'product', 'auto'
      format: options.format || 'jpeg',
      ...options
    };

    return await uploadFile('/image/advanced/smart-crop', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Smart Crop Error:', error);
    throw new Error(`Failed to smart crop image: ${error.message}`);
  }
};

/**
 * Remove objects from an image
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Array<Object>} objects - Objects to remove (coordinates)
 * @param {Object} options - Additional options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const removeObjects = async (imageFile, objects = [], options = {}, onProgress = null) => {
  try {
    const metadata = {
      objects: JSON.stringify(objects),
      format: options.format || 'jpeg',
      ...options
    };

    return await uploadFile('/image/advanced/remove-objects', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Object Removal Error:', error);
    throw new Error(`Failed to remove objects: ${error.message}`);
  }
};

/**
 * Colorize a black and white image
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Object} options - Colorization options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const colorizeImage = async (imageFile, options = {}, onProgress = null) => {
  try {
    const metadata = {
      intensity: options.intensity || 1.0,
      format: options.format || 'jpeg',
      ...options
    };

    return await uploadFile('/image/advanced/colorize', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Image Colorization Error:', error);
    throw new Error(`Failed to colorize image: ${error.message}`);
  }
};

/**
 * Generate image variations
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Object} options - Variation options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data with variations
 */
export const generateVariations = async (imageFile, options = {}, onProgress = null) => {
  try {
    const metadata = {
      count: options.count || 3,
      variationStrength: options.variationStrength || 0.5,
      format: options.format || 'jpeg',
      ...options
    };

    return await uploadFile('/image/advanced/variations', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Generate Variations Error:', error);
    throw new Error(`Failed to generate variations: ${error.message}`);
  }
};

/**
 * Apply artistic style transfer
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {string} styleId - ID of the style to apply
 * @param {Object} options - Style transfer options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const applyStyleTransfer = async (imageFile, styleId, options = {}, onProgress = null) => {
  try {
    const metadata = {
      styleId,
      intensity: options.intensity || 1.0,
      format: options.format || 'jpeg',
      ...options
    };

    return await uploadFile('/image/advanced/style-transfer', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Style Transfer Error:', error);
    throw new Error(`Failed to apply style transfer: ${error.message}`);
  }
};

/**
 * Get available artistic styles
 * 
 * @returns {Promise<Array<Object>>} - List of available styles
 */
export const getAvailableStyles = async () => {
  try {
    return await apiRequest('/image/advanced/styles');
  } catch (error) {
    console.error('Get Styles Error:', error);
    throw new Error(`Failed to get styles: ${error.message}`);
  }
};

export default {
  upscaleImage,
  smartCrop,
  removeObjects,
  colorizeImage,
  generateVariations,
  applyStyleTransfer,
  getAvailableStyles
};

