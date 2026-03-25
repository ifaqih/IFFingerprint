/**
 * Normalize Utilities
 * Fungsi untuk normalisasi data
 */
/**
 * Normalize string untuk konsistensi
 * @param str - String yang akan dinormalisasi
 * @returns Normalized string
 */
export declare function normalizeString(str: string): string;
/**
 * Normalize user agent string
 * @param ua - User agent string
 * @returns Normalized UA
 */
export declare function normalizeUserAgent(ua: string): string;
/**
 * Normalize screen dimensions untuk grouping
 * @param width - Screen width
 * @param height - Screen height
 * @returns Normalized dimensions string
 */
export declare function normalizeScreenDimensions(width: number, height: number): string;
/**
 * Normalize timezone offset
 * @param offset - Offset dalam menit
 * @returns Normalized offset string
 */
export declare function normalizeTimezoneOffset(offset: number): string;
/**
 * Clamp number between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Round to precision
 * @param value - Value to round
 * @param precision - Decimal places
 * @returns Rounded value
 */
export declare function roundToPrecision(value: number, precision?: number): number;
//# sourceMappingURL=normalize.d.ts.map