/**
 * Normalize Utilities
 * Fungsi untuk normalisasi data
 */

/**
 * Normalize string untuk konsistensi
 * @param str - String yang akan dinormalisasi
 * @returns Normalized string
 */
export function normalizeString(str: string): string {
  if (!str) return '';
  
  return str
    .trim()
    .toLowerCase()
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-_.]/g, '');
}

/**
 * Normalize user agent string
 * @param ua - User agent string
 * @returns Normalized UA
 */
export function normalizeUserAgent(ua: string): string {
  if (!ua) return '';
  
  // Remove version numbers yang sering berubah
  return ua
    .replace(/Chrome\/\d+\.\d+\.\d+\.\d+/g, 'Chrome/VERSION')
    .replace(/Firefox\/\d+\.\d+/g, 'Firefox/VERSION')
    .replace(/Safari\/\d+\.\d+/g, 'Safari/VERSION')
    .replace(/Version\/\d+\.\d+/g, 'Version/VERSION')
    .replace(/Edg\/\d+\.\d+\.\d+/g, 'Edg/VERSION')
    .replace(/OPR\/\d+\.\d+\.\d+/g, 'OPR/VERSION');
}

/**
 * Normalize screen dimensions untuk grouping
 * @param width - Screen width
 * @param height - Screen height
 * @returns Normalized dimensions string
 */
export function normalizeScreenDimensions(width: number, height: number): string {
  // Group ke dalam bucket 100px
  const bucketWidth = Math.floor(width / 100) * 100;
  const bucketHeight = Math.floor(height / 100) * 100;
  return `${bucketWidth}x${bucketHeight}`;
}

/**
 * Normalize timezone offset
 * @param offset - Offset dalam menit
 * @returns Normalized offset string
 */
export function normalizeTimezoneOffset(offset: number): string {
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Clamp number between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to precision
 * @param value - Value to round
 * @param precision - Decimal places
 * @returns Rounded value
 */
export function roundToPrecision(value: number, precision: number = 0): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}
