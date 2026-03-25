/**
 * Hash Utilities
 * Implementasi hash function untuk fingerprinting
 * Menggunakan algoritma MurmurHash3 dengan 128-bit output untuk keunikan maksimal
 */
/**
 * Generate hash dari string menggunakan algoritma MurmurHash3
 * Menggunakan 4 x 32-bit hash dengan seed berbeda untuk menghasilkan 128-bit hash (32 karakter hex)
 * @param str - String yang akan di-hash
 * @param seed - Seed value (default: 0x9747b28c)
 * @returns Hash dalam format hexadecimal (32 karakter)
 */
export declare function hashString(str: string, seed?: number): string;
/**
 * MurmurHash3 implementation
 * @param key - String yang akan di-hash
 * @param seed - Seed value
 * @returns 32-bit hash
 */
export declare function murmurhash3_32(key: string, seed?: number): number;
/**
 * Generate hash dari object
 * @param obj - Object yang akan di-hash
 * @returns Hash dalam format hexadecimal
 */
export declare function hashObject(obj: Record<string, any>): string;
/**
 * Combine multiple hashes menjadi satu
 * @param hashes - Array hash strings
 * @returns Combined hash
 */
export declare function combineHashes(hashes: string[]): string;
/**
 * Generate hash dengan komponen yang weighted
 * @param components - Object dengan component name dan value
 * @param weights - Object dengan component name dan weight
 * @returns Weighted hash
 */
export declare function weightedHash(components: Record<string, string>, weights: Record<string, number>): string;
//# sourceMappingURL=hash.d.ts.map