
/**
 * Application color palette definitions
 */
export const colors = {
  navy: {
    base: '#1a2a4a',
    light: '#2a3a5a',
    dark: '#0a1a3a',
  },
  beige: {
    base: '#f5f1e8',
    light: '#ffffff',
    dark: '#e5e1d8',
  },
  blue: {
    base: '#3b82f6',
    muted: '#60a5fa',
  }
};

/**
 * Adjusts color opacity
 * @param {string} hex - The hex color code
 * @param {number} opacity - The opacity value between 0 and 1
 * @returns {string} The rgba color string
 */
export const hexToRgba = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
