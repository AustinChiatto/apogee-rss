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

// formats large numbers
export const formatNumber = (value: number | string, decimals: number = 0): string => {
  try {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
      return String(value);
    }

    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(value);
  }
};
