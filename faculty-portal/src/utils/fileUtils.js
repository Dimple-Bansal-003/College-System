export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename) {
  return '.' + filename.split('.').pop().toLowerCase();
}

export function isValidFileType(filename, allowedExtensions = ['.pdf', '.doc', '.docx', '.txt']) {
  const ext = getFileExtension(filename);
  return allowedExtensions.includes(ext);
}

export function isValidFileSize(size, maxSizeMB = 10) {
  return size <= maxSizeMB * 1024 * 1024;
}

export function validateFile(file, options = {}) {
  const { maxSizeMB = 10, allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'] } = options;

  const errors = [];

  if (!isValidFileSize(file.size, maxSizeMB)) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  if (!isValidFileType(file.name, allowedExtensions)) {
    errors.push(`Only ${allowedExtensions.join(', ')} files are allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}