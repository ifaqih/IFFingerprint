/**
 * Type Guards
 * Utility functions untuk type checking
 */
/**
 * Check jika value adalah defined (tidak undefined)
 */
export declare function isDefined<T>(value: T | undefined): value is T;
/**
 * Check jika value adalah undefined
 */
export declare function isUndefined<T>(value: T | undefined): value is undefined;
/**
 * Check jika value adalah null
 */
export declare function isNull<T>(value: T | null): value is null;
/**
 * Check jika value adalah null atau undefined
 */
export declare function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined;
/**
 * Check jika value adalah string
 */
export declare function isString(value: unknown): value is string;
/**
 * Check jika value adalah number
 */
export declare function isNumber(value: unknown): value is number;
/**
 * Check jika value adalah boolean
 */
export declare function isBoolean(value: unknown): value is boolean;
/**
 * Check jika value adalah object
 */
export declare function isObject(value: unknown): value is Record<string, unknown>;
/**
 * Check jika value adalah array
 */
export declare function isArray<T>(value: unknown): value is T[];
/**
 * Check jika value adalah function
 */
export declare function isFunction(value: unknown): value is Function;
/**
 * Check jika string tidak kosong
 */
export declare function isNonEmptyString(value: unknown): value is string;
/**
 * Check jika value adalah plain object
 */
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
//# sourceMappingURL=guards.d.ts.map