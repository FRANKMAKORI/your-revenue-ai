/**
 * Removes markdown asterisks and formatting from text while preserving readability
 */
export const formatMessage = (content: string): string => {
  return content
    // Remove bold asterisks **text** or __text__
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remove italic asterisks *text* or _text_
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove bullet point asterisks at line start
    .replace(/^\s*\*\s+/gm, '• ')
    // Remove numbered list formatting
    .replace(/^\s*\d+\.\s+/gm, (match) => match.replace(/\d+\./, (num) => num))
    // Remove headers (#, ##, ###)
    .replace(/^#{1,6}\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
