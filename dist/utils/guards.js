/**
 * Type Guards
 * Utility functions untuk type checking
 */
/**
 * Check jika value adalah defined (tidak undefined)
 */
export function isDefined(value) {
    return value !== undefined;
}
/**
 * Check jika value adalah undefined
 */
export function isUndefined(value) {
    return value === undefined;
}
/**
 * Check jika value adalah null
 */
export function isNull(value) {
    return value === null;
}
/**
 * Check jika value adalah null atau undefined
 */
export function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
/**
 * Check jika value adalah string
 */
export function isString(value) {
    return typeof value === 'string';
}
/**
 * Check jika value adalah number
 */
export function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
/**
 * Check jika value adalah boolean
 */
export function isBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * Check jika value adalah object
 */
export function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Check jika value adalah array
 */
export function isArray(value) {
    return Array.isArray(value);
}
/**
 * Check jika value adalah function
 */
export function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Check jika string tidak kosong
 */
export function isNonEmptyString(value) {
    return isString(value) && value.trim().length > 0;
}
/**
 * Check jika value adalah plain object
 */
export function isPlainObject(value) {
    if (!isObject(value))
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
}
//# sourceMappingURL=guards.js.map