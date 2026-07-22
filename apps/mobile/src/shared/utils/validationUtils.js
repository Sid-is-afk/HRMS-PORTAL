/**
 * Validation utilities and regex patterns
 */

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return REGEX.EMAIL.test(email);
};

/**
 * Validate password strength
 * Requires at least 8 characters, one letter and one number
 */
export const isValidPassword = (password) => {
  return REGEX.PASSWORD.test(password);
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, or empty object)
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};
