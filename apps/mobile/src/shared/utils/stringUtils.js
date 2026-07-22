/**
 * String manipulation utilities
 */

/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Format snake_case or camelCase to Title Case (e.g., "CLOCKED_IN" -> "Clocked In")
 */
export const formatEnumToTitle = (string) => {
  if (!string) return '';
  return string
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => capitalizeFirstLetter(word.toLowerCase()))
    .join(' ');
};

/**
 * Truncate a string to a specific length and append ellipsis
 */
export const truncateString = (string, maxLength) => {
  if (!string) return '';
  if (string.length <= maxLength) return string;
  return string.slice(0, maxLength) + '...';
};

/**
 * Generate user initials from name
 */
export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
