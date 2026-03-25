/**
 * IFFingerprint Engine
 * Main engine untuk mengumpulkan dan memproses semua fingerprint components
 */
import { FingerprintResult, FingerprintComponents, IFFingerprintConfig, GenerateOptions } from "../types";
/**
 * Versi library IFFingerprint
 */
export declare const IFFINGERPRINT_VERSION = "1.0.0";
/**
 * IFFingerprint Class
 * Main class untuk generate browser fingerprint
 */
export declare class IFFingerprint {
    private config;
    private cache;
    private cacheTimestamp;
    private collectors;
    constructor(config?: Partial<IFFingerprintConfig>);
    /**
     * Initialize semua collectors
     */
    private initializeCollectors;
    /**
     * Generate fingerprint
     * @param options - Opsi untuk generate
     * @returns Promise<FingerprintResult>
     */
    generate(options?: GenerateOptions): Promise<FingerprintResult>;
    /**
     * Get fingerprint hash saja (shortcut)
     */
    get(): Promise<string>;
    /**
     * Get components saja (shortcut)
     */
    getComponents(): Promise<FingerprintComponents>;
    /**
     * Check jika cache masih valid
     */
    private isCacheValid;
    /**
     * Calculate confidence score berdasarkan komponen yang berhasil dikumpulkan
     */
    private calculateConfidence;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Update konfigurasi
     */
    updateConfig(config: Partial<IFFingerprintConfig>): void;
    /**
     * Get versi library
     */
    getVersion(): string;
    /**
     * Get konfigurasi saat ini
     */
    getConfig(): IFFingerprintConfig;
    /**
     * Enable/disable collector tertentu
     */
    setCollectorEnabled(name: string, enabled: boolean): void;
    /**
     * Check jika collector enabled
     */
    isCollectorEnabled(name: string): boolean;
    /**
     * Get daftar semua collectors
     */
    getCollectors(): string[];
    /**
     * Get daftar collectors yang enabled
     */
    getEnabledCollectors(): string[];
    /**
     * Compare dua fingerprint
     */
    static compare(fp1: string, fp2: string): boolean;
    /**
     * Calculate similarity antara dua fingerprint (untuk fuzzy matching)
     */
    static similarity(fp1: string, fp2: string): number;
    /**
     * Levenshtein distance untuk similarity calculation
     */
    private static levenshteinDistance;
}
/**
 * Export default instance
 */
export default IFFingerprint;
//# sourceMappingURL=IFFingerprintEngine.d.ts.map