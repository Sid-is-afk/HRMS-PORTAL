/**
 * File management utilities
 */

/**
 * Returns human readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extract extension from filename
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

/**
 * Validate file against allowed extensions and size
 * Note: Actual File Picker logic (expo-document-picker) should be handled via a custom hook, 
 * but this serves as the validation layer.
 */
export const validateFile = (file, options = {}) => {
  const { maxSizeMB = 5, allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'] } = options;
  
  if (!file) return { isValid: false, error: 'No file provided' };
  
  const extension = getFileExtension(file.name);
  if (!allowedTypes.includes(extension)) {
    return { isValid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` };
  }
  
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return { isValid: false, error: `File is too large. Maximum size is ${maxSizeMB}MB` };
  }
  
  return { isValid: true, error: null };
};
