/**
 * Image Processing Service
 * 
 * This module provides functions for processing images using the API.
 * It handles background removal, enhancements, filters, and adjustments.
 */

import { uploadFile } from './api';

/**
 * Remove background from an image
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Object} options - Background removal options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const removeBackground = async (imageFile, options = {}, onProgress = null) => {
  try {
    const metadata = {
      refinement: options.refinement || 'auto',
      format: options.format || 'png',
      ...options
    };

    return await uploadFile('/image/remove-background', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Background Removal Error:', error);
    throw new Error(`Failed to remove background: ${error.message}`);
  }
};

/**
 * Enhance an image
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Object} options - Enhancement options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const enhanceImage = async (imageFile, options = {}, onProgress = null) => {
  try {
    const metadata = {
      enhancement: options.enhancement || 'auto',
      format: options.format || 'jpeg',
      quality: options.quality || 'high',
      ...options
    };

    return await uploadFile('/image/enhance', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Image Enhancement Error:', error);
    throw new Error(`Failed to enhance image: ${error.message}`);
  }
};

/**
 * Apply a filter to an image
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {string} filterId - ID of the filter to apply
 * @param {Object} options - Filter options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const applyFilter = async (imageFile, filterId, options = {}, onProgress = null) => {
  try {
    const metadata = {
      filter: filterId,
      intensity: options.intensity || 1.0,
      format: options.format || 'jpeg',
      ...options
    };

    return await uploadFile('/image/filter', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Apply Filter Error:', error);
    throw new Error(`Failed to apply filter: ${error.message}`);
  }
};

/**
 * Apply adjustments to an image
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Object} adjustments - Adjustment values
 * @param {Object} options - Additional options
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed image data
 */
export const applyAdjustments = async (imageFile, adjustments = {}, options = {}, onProgress = null) => {
  try {
    const metadata = {
      ...adjustments,
      format: options.format || 'jpeg',
      quality: options.quality || 'high',
      ...options
    };

    return await uploadFile('/image/adjust', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Apply Adjustments Error:', error);
    throw new Error(`Failed to apply adjustments: ${error.message}`);
  }
};

/**
 * Process multiple images in batch
 * 
 * @param {Array<File|Blob>} imageFiles - Array of image files or blobs
 * @param {Object} settings - Batch processing settings
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Processed images data
 */
export const batchProcess = async (imageFiles, settings = {}, onProgress = null) => {
  try {
    // Create form data with all files
    const formData = new FormData();
    
    // Add each file
    imageFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    
    // Add settings as JSON
    formData.append('settings', JSON.stringify(settings));
    
    return await uploadFile('/image/batch', formData, {}, onProgress);
  } catch (error) {
    console.error('Batch Processing Error:', error);
    throw new Error(`Failed to process batch: ${error.message}`);
  }
};

/**
 * Get available filters
 * 
 * @returns {Promise<Array<Object>>} - List of available filters
 */
export const getAvailableFilters = async () => {
  try {
    // In a real app, this would fetch from the API
    // For now, return a static list
    return [
      { id: 'vintage', name: 'Vintage', preview: 'sepia(0.5) contrast(1.2)' },
      { id: 'dramatic', name: 'Dramatic', preview: 'contrast(1.5) saturate(1.3)' },
      { id: 'cool', name: 'Cool', preview: 'hue-rotate(180deg) saturate(1.1)' },
      { id: 'warm', name: 'Warm', preview: 'hue-rotate(20deg) saturate(1.2)' },
      { id: 'bw', name: 'Black & White', preview: 'grayscale(1)' },
      { id: 'soft', name: 'Soft', preview: 'blur(0.5px) brightness(1.1)' }
    ];
  } catch (error) {
    console.error('Get Filters Error:', error);
    throw new Error(`Failed to get filters: ${error.message}`);
  }
};

export default {
  removeBackground,
  enhanceImage,
  applyFilter,
  applyAdjustments,
  batchProcess,
  getAvailableFilters
};

