export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateFile(file, options = {}) {
  const { maxSizeMB = 10, allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'] } = options;
  const errors = [];
  if (file.size > maxSizeMB * 1024 * 1024) errors.push(`File size must be less than ${maxSizeMB}MB`);
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) errors.push(`Only ${allowedExtensions.join(', ')} files are allowed`);
  return { isValid: errors.length === 0, errors };
}