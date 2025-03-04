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
