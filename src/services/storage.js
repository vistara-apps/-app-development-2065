/**
 * Storage Service
 * 
 * This module provides functions for managing image storage.
 * It handles uploading, downloading, and managing stored images.
 */

import { apiRequest, uploadFile } from './api';

/**
 * Upload an image to storage
 * 
 * @param {File|Blob} imageFile - The image file or blob
 * @param {Object} metadata - Image metadata
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Uploaded image data
 */
export const uploadImage = async (imageFile, metadata = {}, onProgress = null) => {
  try {
    return await uploadFile('/storage/upload', imageFile, metadata, onProgress);
  } catch (error) {
    console.error('Image Upload Error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Get user's images
 * 
 * @param {Object} options - Pagination and filtering options
 * @returns {Promise<Object>} - User's images with pagination info
 */
export const getUserImages = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 20,
      sortBy: options.sortBy || 'createdAt',
      sortOrder: options.sortOrder || 'desc',
      ...options
    }).toString();

    return await apiRequest(`/storage/images?${queryParams}`);
  } catch (error) {
    console.error('Get User Images Error:', error);
    throw new Error(`Failed to get images: ${error.message}`);
  }
};

/**
 * Get image details
 * 
 * @param {string} imageId - ID of the image
 * @returns {Promise<Object>} - Image details
 */
export const getImageDetails = async (imageId) => {
  try {
    return await apiRequest(`/storage/images/${imageId}`);
  } catch (error) {
    console.error('Get Image Details Error:', error);
    throw new Error(`Failed to get image details: ${error.message}`);
  }
};

/**
 * Delete an image
 * 
 * @param {string} imageId - ID of the image to delete
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteImage = async (imageId) => {
  try {
    return await apiRequest(`/storage/images/${imageId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Delete Image Error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Update image metadata
 * 
 * @param {string} imageId - ID of the image
 * @param {Object} metadata - Updated metadata
 * @returns {Promise<Object>} - Updated image data
 */
export const updateImageMetadata = async (imageId, metadata) => {
  try {
    return await apiRequest(`/storage/images/${imageId}`, {
      method: 'PATCH',
      body: metadata
    });
  } catch (error) {
    console.error('Update Image Metadata Error:', error);
    throw new Error(`Failed to update image metadata: ${error.message}`);
  }
};

/**
 * Get storage usage
 * 
 * @returns {Promise<Object>} - Storage usage data
 */
export const getStorageUsage = async () => {
  try {
    return await apiRequest('/storage/usage');
  } catch (error) {
    console.error('Get Storage Usage Error:', error);
    throw new Error(`Failed to get storage usage: ${error.message}`);
  }
};

/**
 * Create a folder
 * 
 * @param {string} folderName - Name of the folder
 * @param {string} parentFolder - Parent folder path
 * @returns {Promise<Object>} - Created folder data
 */
export const createFolder = async (folderName, parentFolder = '') => {
  try {
    return await apiRequest('/storage/folders', {
      method: 'POST',
      body: {
        name: folderName,
        parent: parentFolder
      }
    });
  } catch (error) {
    console.error('Create Folder Error:', error);
    throw new Error(`Failed to create folder: ${error.message}`);
  }
};

/**
 * Get folders
 * 
 * @returns {Promise<Array<Object>>} - List of folders
 */
export const getFolders = async () => {
  try {
    return await apiRequest('/storage/folders');
  } catch (error) {
    console.error('Get Folders Error:', error);
    throw new Error(`Failed to get folders: ${error.message}`);
  }
};

/**
 * Delete a folder
 * 
 * @param {string} folderId - ID of the folder to delete
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteFolder = async (folderId) => {
  try {
    return await apiRequest(`/storage/folders/${folderId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Delete Folder Error:', error);
    throw new Error(`Failed to delete folder: ${error.message}`);
  }
};

/**
 * Move images to a folder
 * 
 * @param {Array<string>} imageIds - IDs of the images to move
 * @param {string} folderId - ID of the destination folder
 * @returns {Promise<Object>} - Move confirmation
 */
export const moveImagesToFolder = async (imageIds, folderId) => {
  try {
    return await apiRequest('/storage/move', {
      method: 'POST',
      body: {
        imageIds,
        folderId
      }
    });
  } catch (error) {
    console.error('Move Images Error:', error);
    throw new Error(`Failed to move images: ${error.message}`);
  }
};

/**
 * Download an image
 * 
 * @param {string} imageId - ID of the image to download
 * @returns {Promise<Blob>} - Image blob
 */
export const downloadImage = async (imageId) => {
  try {
    const response = await apiRequest(`/storage/images/${imageId}/download`, {
      responseType: 'blob'
    });
    
    return response;
  } catch (error) {
    console.error('Download Image Error:', error);
    throw new Error(`Failed to download image: ${error.message}`);
  }
};

export default {
  uploadImage,
  getUserImages,
  getImageDetails,
  deleteImage,
  updateImageMetadata,
  getStorageUsage,
  createFolder,
  getFolders,
  deleteFolder,
  moveImagesToFolder,
  downloadImage
};

