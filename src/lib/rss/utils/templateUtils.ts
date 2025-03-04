/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncate(text: string, maxCharacters: number): string {
  if (!text || text.length <= maxCharacters) {
    return text || '';
  }
  return text.slice(0, maxCharacters) + '...';
}

/**
 * Conditionally renders HTML only if the value exists
 */
export function renderIf<T>(value: T | null | undefined, render: (val: T) => string, defaultRender?: () => string): string {
  try {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'number' && isNaN(value))
    ) {
      return defaultRender ? defaultRender() : '';
    }
    return render(value);
  } catch (error) {
    console.error('Error in renderIf:', error);
    return defaultRender ? defaultRender() : '';
  }
}

/**
 * Renders a section only if its content is not empty
 */
export function renderSection(content: string): string {
  return content.trim() ? content : '';
}

// date to human string
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric'
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    };

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return `${formattedDate}, ${formattedTime}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formats a number with commas as thousands separators
 * @param value The number to format
 * @param decimals Optional number of decimal places (default: 0)
 * @returns Formatted number string with commas
 */
export const formatNumber = (value: number | string, decimals: number = 0): string => {
  try {
    // Check if value is null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    // For string values that represent currency or large numbers with specific formatting
    if (typeof value === 'string') {
      // If it starts with currency symbol, preserve it
      if (value.startsWith('$')) {
        const numPart = value.substring(1);
        // Try to parse the numeric part
        const num = parseFloat(numPart);
        if (isNaN(num)) {
          return value; // Return original if can't parse
        }
        // Format with commas but preserve all digits
        return (
          '$' +
          num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          })
        );
      }

      // Special handling for values that might be stored as strings but represent large numbers
      // This preserves trailing zeros that might be significant (like in "$52000000")
      if (/^\d+$/.test(value)) {
        // If it's a string of digits, format it while preserving all digits
        const formattedValue = parseInt(value).toLocaleString('en-US');
        return formattedValue;
      }
    }

    // Standard number formatting for regular numbers
    const num = typeof value === 'string' ? parseFloat(value) : value;

    // Check if it's a valid number
    if (isNaN(num)) {
      return String(value);
    }

    // Format with commas and specified decimal places
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(value);
  }
};
