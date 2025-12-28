/**
 * Utility functions for formatting numeric values from API responses
 * API returns numeric values as strings, these functions handle parsing and formatting
 */

/**
 * Format a price value (from string or number) to a fixed decimal string
 * @param value - The price value (can be string or number)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string or '0.00' if invalid
 */
export const formatPrice = (value: string | number | null | undefined, decimals: number = 0): string => {
  if (value === null || value === undefined || value === '') {
    return '0.' + '0'.repeat(decimals);
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0.' + '0'.repeat(decimals);
  }

  return numValue.toFixed(decimals);
};

/**
 * Format a rating value (from string or number) to a fixed decimal string
 * @param value - The rating value (can be string or number)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted rating string or '0.0' if invalid
 */
export const formatRating = (value: string | number | null | undefined, decimals: number = 1): string => {
  if (value === null || value === undefined || value === '') {
    return '0.' + '0'.repeat(decimals);
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0.' + '0'.repeat(decimals);
  }

  return numValue.toFixed(decimals);
};

/**
 * Parse a numeric string to number safely
 * @param value - The value to parse
 * @param defaultValue - Default value if parsing fails (default: 0)
 * @returns Parsed number or default value
 */
export const parseNumeric = (value: string | number | null | undefined, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return defaultValue;
  }

  return numValue;
};

/**
 * Format currency with symbol
 * @param value - The price value
 * @param symbol - Currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., '$10.99')
 */
export const formatCurrency = (
  value: string | number | null | undefined,
  symbol: string = '$',
  decimals: number = 2
): string => {
  return `${symbol}${formatPrice(value, decimals)}`;
};
