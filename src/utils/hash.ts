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
export function hashString(str: string, seed: number = 0x9747b28c): string {
  // Generate 4 x 32-bit hash dengan seed berbeda untuk total 128-bit
  const hash1 = murmurhash3_32(str, seed);
  const hash2 = murmurhash3_32(str, seed + 1);
  const hash3 = murmurhash3_32(str, seed + 2);
  const hash4 = murmurhash3_32(str, seed + 3);

  // Combine menjadi 128-bit hash (32 karakter hex)
  const combined =
    (hash1 >>> 0).toString(16).padStart(8, "0") +
    (hash2 >>> 0).toString(16).padStart(8, "0") +
    (hash3 >>> 0).toString(16).padStart(8, "0") +
    (hash4 >>> 0).toString(16).padStart(8, "0");

  return combined;
}

/**
 * MurmurHash3 implementation
 * @param key - String yang akan di-hash
 * @param seed - Seed value
 * @returns 32-bit hash
 */
export function murmurhash3_32(key: string, seed: number = 0): number {
  const len = key.length;
  if (len === 0) return 0;

  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  const r1 = 15;
  const r2 = 13;
  const m = 5;
  const n = 0xe6546b64;

  let hash = seed;
  const nBlocks = len >> 2;

  // Process 4-byte blocks
  for (let i = 0; i < nBlocks; i++) {
    let k = key.charCodeAt(i * 4) & 0xff;
    k |= (key.charCodeAt(i * 4 + 1) & 0xff) << 8;
    k |= (key.charCodeAt(i * 4 + 2) & 0xff) << 16;
    k |= (key.charCodeAt(i * 4 + 3) & 0xff) << 24;

    k = Math.imul(k, c1);
    k = (k << r1) | (k >>> (32 - r1));
    k = Math.imul(k, c2);

    hash ^= k;
    hash = (hash << r2) | (hash >>> (32 - r2));
    hash = Math.imul(hash, m) + n;
  }

  // Process remaining bytes
  const remainder = len & 3;
  let k = 0;

  switch (remainder) {
    case 3:
      k ^= (key.charCodeAt(nBlocks * 4 + 2) & 0xff) << 16;
    // eslint-disable-next-line no-fallthrough
    case 2:
      k ^= (key.charCodeAt(nBlocks * 4 + 1) & 0xff) << 8;
    // eslint-disable-next-line no-fallthrough
    case 1:
      k ^= key.charCodeAt(nBlocks * 4) & 0xff;
      k = Math.imul(k, c1);
      k = (k << r1) | (k >>> (32 - r1));
      k = Math.imul(k, c2);
      hash ^= k;
    // eslint-disable-next-line no-fallthrough
    case 0:
      break;
    default:
      break;
  }

  // Finalization
  hash ^= len;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  return hash >>> 0;
}

/**
 * Generate hash dari object
 * @param obj - Object yang akan di-hash
 * @returns Hash dalam format hexadecimal
 */
export function hashObject(obj: Record<string, any>): string {
  const sorted = Object.keys(obj)
    .sort()
    .map((key) => `${key}:${JSON.stringify(obj[key])}`)
    .join("|");

  return hashString(sorted);
}

/**
 * Combine multiple hashes menjadi satu
 * @param hashes - Array hash strings
 * @returns Combined hash
 */
export function combineHashes(hashes: string[]): string {
  const combined = hashes.join(":");
  return hashString(combined);
}

/**
 * Generate hash dengan komponen yang weighted
 * @param components - Object dengan component name dan value
 * @param weights - Object dengan component name dan weight
 * @returns Weighted hash
 */
export function weightedHash(
  components: Record<string, string>,
  weights: Record<string, number>,
): string {
  const weighted = Object.entries(components)
    .map(([key, value]) => {
      const weight = weights[key] || 1;
      return value.repeat(weight);
    })
    .join("|");

  return hashString(weighted);
}
