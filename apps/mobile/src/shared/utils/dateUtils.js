/**
 * Date and time formatting utilities
 */

/**
 * Format a date string into standard app format (e.g., "Jan 1, 2024")
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const defaultOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, { ...defaultOptions, ...options });
};

/**
 * Format an ISO string or Date into HH:MM (e.g., "09:00 AM")
 */
export const formatTime = (dateString, options = {}) => {
  if (!dateString) return '--:--';
  const defaultOptions = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString(undefined, { ...defaultOptions, ...options });
};

/**
 * Calculate difference in hours between two times
 */
export const calculateHoursDifference = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diff = Math.abs(end - start);
  return Number((diff / (1000 * 60 * 60)).toFixed(2));
};

/**
 * Check if a date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};
