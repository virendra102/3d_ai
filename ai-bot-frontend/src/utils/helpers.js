/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

/**
 * Truncate a string to a certain length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 30) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Extract filename from PDF path
 * @param {string} path - Full path
 * @returns {string} Filename
 */
export const getFilenameFromPath = (path) => {
  if (!path) return '';
  return path.split('/').pop();
};

/**
 * Handle API errors and return friendly message
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.response.status === 401 || error.response.status === 403) {
      return 'You do not have permission to access this resource.';
    }
    if (error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  }
  
  return 'An unexpected error occurred. Please try again later.';
}; 