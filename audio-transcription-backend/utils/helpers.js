const fs = require('fs');
const path = require('path');

/**
 * Utility functions for the Voice-to-Notes AI backend
 */

/**
 * Clean up temporary files
 * @param {string} filePath - Path to the file to delete
 * @returns {boolean} - Success status
 */
const cleanupFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Cleaned up: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.warn(`⚠️ Failed to clean up ${filePath}:`, error.message);
        return false;
    }
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean} - Whether file size is valid
 */
const validateFileSize = (size, maxSize = 25 * 1024 * 1024) => {
    return size <= maxSize;
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - File extension (without dot)
 */
const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase().slice(1);
};

/**
 * Check if file is an audio file
 * @param {string} filename - The filename
 * @returns {boolean} - Whether file is audio
 */
const isAudioFile = (filename) => {
    const audioExtensions = ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'];
    const extension = getFileExtension(filename);
    return audioExtensions.includes(extension);
};

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const extension = path.extname(originalName);
    return `audio-${timestamp}-${random}${extension}`;
};

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 * @returns {boolean} - Success status
 */
const ensureDirectoryExists = (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created directory: ${dirPath}`);
        }
        return true;
    } catch (error) {
        console.error(`❌ Failed to create directory ${dirPath}:`, error.message);
        return false;
    }
};

/**
 * Get server uptime in a readable format
 * @param {number} startTime - Server start time
 * @returns {string} - Formatted uptime
 */
const getUptime = (startTime) => {
    const uptime = Date.now() - startTime;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
};

module.exports = {
    cleanupFile,
    validateFileSize,
    getFileExtension,
    isAudioFile,
    generateUniqueFilename,
    formatFileSize,
    ensureDirectoryExists,
    getUptime
}; 