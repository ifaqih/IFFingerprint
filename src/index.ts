/**
 * IFFingerprint Library
 * 
 * Library fingerprinting browser dengan akurasi tinggi
 * untuk identifikasi pengguna unik
 * 
 * @version 1.0.0
 * @author IFFingerprint
 * @license MIT
 */

// Export types
export * from './types';

// Export core
export { IFFingerprint, IFFINGERPRINT_VERSION } from './core';

// Export collectors
export * from './collectors';

// Export utils
export * from './utils';

// Default export
import { IFFingerprint } from './core';
export default IFFingerprint;
