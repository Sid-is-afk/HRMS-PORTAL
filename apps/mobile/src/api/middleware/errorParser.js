/**
 * Centralized error mapping and parsing.
 * Converts raw axios errors into a standard application error object.
 */
export const parseApiError = (error) => {
  // Network errors or timeout
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return { message: 'Request timed out. Please try again.', code: 'TIMEOUT' };
    }
    return { message: 'Network error. Please check your connection.', code: 'NETWORK_ERROR' };
  }

  // HTTP Errors
  const { status, data } = error.response;
  
  // Try to extract standard backend error message if exists
  const serverMessage = data?.error?.message || data?.message;
  
  switch (status) {
    case 400:
      return { message: serverMessage || 'Invalid request. Please check your input.', code: 'BAD_REQUEST', data };
    case 401:
      return { message: serverMessage || 'Your session has expired. Please log in again.', code: 'UNAUTHORIZED' };
    case 403:
      return { message: serverMessage || 'You do not have permission to perform this action.', code: 'FORBIDDEN' };
    case 404:
      return { message: serverMessage || 'The requested resource was not found.', code: 'NOT_FOUND' };
    case 422:
      return { message: serverMessage || 'Validation failed. Please check the entered data.', code: 'VALIDATION_ERROR', validationErrors: data?.errors };
    case 429:
      return { message: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' };
    case 500:
    case 502:
    case 503:
    case 504:
      return { message: 'Our servers are currently experiencing issues. Please try again later.', code: 'SERVER_ERROR' };
    default:
      return { message: serverMessage || 'An unexpected error occurred.', code: 'UNKNOWN' };
  }
};
