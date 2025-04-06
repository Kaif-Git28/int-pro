/**
 * Formats a number as a percentage with the specified number of decimal places
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formats a date string or Date object to a localized date string
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

/**
 * Formats a date string or Date object to a localized time string
 */
export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString();
};

/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Converts a temperature value between Celsius and Fahrenheit
 */
export const convertTemperature = (value: number, to: 'C' | 'F'): number => {
  if (to === 'F') {
    // Convert Celsius to Fahrenheit
    return (value * 9/5) + 32;
  } else {
    // Convert Fahrenheit to Celsius
    return (value - 32) * 5/9;
  }
};

/**
 * Format a number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value);
}; 