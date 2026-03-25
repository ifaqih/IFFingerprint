/**
 * IFFingerprint Engine
 * Main engine untuk mengumpulkan dan memproses semua fingerprint components
 */
import { NavigatorCollector, ScreenCollector, CanvasCollector, WebGLCollector, AudioCollector, FontsCollector, HardwareCollector, BrowserCollector, TimezoneCollector, LanguageCollector, PlatformCollector, TouchCollector, ConnectionCollector, PermissionsCollector, MediaDevicesCollector, StorageCollector, 
// Advanced collectors
CSSCollector, MathCollector, SpeechCollector, } from "../collectors";
import { combineHashes, hashString } from "../utils";
/**
 * Versi library IFFingerprint
 */
export const IFFINGERPRINT_VERSION = "1.0.0";
/**
 * Konfigurasi default
 */
const DEFAULT_CONFIG = {
    collectors: {
        navigator: true,
        screen: true,
        canvas: true,
        webgl: true,
        audio: true,
        fonts: true,
        hardware: true,
        browser: true,
        timezone: true,
        language: true,
        platform: true,
        touch: true,
        connection: true,
        permissions: false, // Requires user permission
        mediaDevices: false, // Requires user permission
        storage: true,
        behavioral: false,
        // Advanced collectors
        css: true,
        math: true,
        speech: true,
    },
    cacheEnabled: true,
    cacheDuration: 300000, // 5 menit
    behavioralEnabled: false,
    debug: false,
};
/**
 * Weight untuk setiap komponen (untuk confidence score)
 */
const COMPONENT_WEIGHTS = {
    canvas: 3,
    webgl: 3,
    audio: 2,
    fonts: 2,
    navigator: 1,
    screen: 1,
    hardware: 2,
    browser: 1,
    timezone: 1,
    language: 1,
    platform: 1,
    touch: 1,
    connection: 1,
    permissions: 1,
    mediaDevices: 2,
    storage: 1,
    behavioral: 2,
    // Advanced collectors
    css: 2,
    math: 2,
    speech: 2,
};
/**
 * IFFingerprint Class
 * Main class untuk generate browser fingerprint
 */
export class IFFingerprint {
    constructor(config) {
        this.cache = null;
        this.cacheTimestamp = 0;
        this.collectors = {};
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.initializeCollectors();
        if (this.config.debug) {
            console.log("[IFFingerprint] Initialized with config:", this.config);
        }
    }
    /**
     * Initialize semua collectors
     */
    initializeCollectors() {
        this.collectors = {
            navigator: new NavigatorCollector(),
            screen: new ScreenCollector(),
            canvas: new CanvasCollector(),
            webgl: new WebGLCollector(),
            audio: new AudioCollector(),
            fonts: new FontsCollector(),
            hardware: new HardwareCollector(),
            browser: new BrowserCollector(),
            timezone: new TimezoneCollector(),
            language: new LanguageCollector(),
            platform: new PlatformCollector(),
            touch: new TouchCollector(),
            connection: new ConnectionCollector(),
            permissions: new PermissionsCollector(),
            mediaDevices: new MediaDevicesCollector(),
            storage: new StorageCollector(),
            // Advanced collectors
            css: new CSSCollector(),
            math: new MathCollector(),
            speech: new SpeechCollector(),
        };
    }
    /**
     * Generate fingerprint
     * @param options - Opsi untuk generate
     * @returns Promise<FingerprintResult>
     */
    async generate(options) {
        const startTime = performance.now();
        // Check cache
        if (!options?.force && this.config.cacheEnabled && this.isCacheValid()) {
            if (this.config.debug) {
                console.log("[IFFingerprint] Using cached fingerprint");
            }
            return this.cache;
        }
        if (this.config.debug) {
            console.log("[IFFingerprint] Generating new fingerprint");
        }
        const components = {};
        const successfulComponents = [];
        const failedComponents = [];
        const hashes = [];
        // Collect dari setiap collector
        for (const [name, collector] of Object.entries(this.collectors)) {
            const isEnabled = this.config.collectors[name];
            if (!isEnabled) {
                if (this.config.debug) {
                    console.log(`[IFFingerprint] Collector ${name} is disabled`);
                }
                continue;
            }
            try {
                if (this.config.debug) {
                    console.log(`[IFFingerprint] Collecting ${name}...`);
                }
                const data = await collector.collect();
                components[name] = data;
                successfulComponents.push(name);
                // Extract hash dari data jika ada
                if (data && typeof data === "object" && "hash" in data && data.hash) {
                    hashes.push(data.hash);
                }
                else {
                    // Generate hash dari data
                    hashes.push(hashString(JSON.stringify(data)));
                }
                options?.onProgress?.(name, "success");
            }
            catch (error) {
                console.warn(`[IFFingerprint] Error collecting ${name}:`, error);
                failedComponents.push(name);
                options?.onProgress?.(name, "error");
            }
        }
        // Combine semua hashes
        const fingerprint = combineHashes(hashes);
        // Calculate confidence score
        const confidence = this.calculateConfidence(successfulComponents, failedComponents);
        const endTime = performance.now();
        const duration = endTime - startTime;
        const result = {
            fingerprint,
            components: components,
            metadata: {
                timestamp: Date.now(),
                version: IFFINGERPRINT_VERSION,
                duration: Math.round(duration * 100) / 100,
                successfulComponents,
                failedComponents,
                browser: components.browser?.name || "Unknown",
                engine: components.browser?.engine || "Unknown",
            },
            confidence,
        };
        // Cache result
        if (this.config.cacheEnabled) {
            this.cache = result;
            this.cacheTimestamp = Date.now();
        }
        if (this.config.debug) {
            console.log("[IFFingerprint] Fingerprint generated:", {
                fingerprint,
                confidence,
                duration: `${duration.toFixed(2)}ms`,
            });
        }
        return result;
    }
    /**
     * Get fingerprint hash saja (shortcut)
     */
    async get() {
        const result = await this.generate();
        return result.fingerprint;
    }
    /**
     * Get components saja (shortcut)
     */
    async getComponents() {
        const result = await this.generate();
        return result.components;
    }
    /**
     * Check jika cache masih valid
     */
    isCacheValid() {
        if (!this.cache)
            return false;
        const age = Date.now() - this.cacheTimestamp;
        return age < this.config.cacheDuration;
    }
    /**
     * Calculate confidence score berdasarkan komponen yang berhasil dikumpulkan
     */
    calculateConfidence(successful, failed) {
        let totalWeight = 0;
        let obtainedWeight = 0;
        for (const component of successful) {
            const weight = COMPONENT_WEIGHTS[component] || 1;
            totalWeight += weight;
            obtainedWeight += weight;
        }
        for (const component of failed) {
            const weight = COMPONENT_WEIGHTS[component] || 1;
            totalWeight += weight;
        }
        if (totalWeight === 0)
            return 0;
        // Base confidence dari weight
        let confidence = (obtainedWeight / totalWeight) * 100;
        // Bonus untuk komponen penting
        const importantComponents = ["canvas", "webgl", "audio", "fonts"];
        const hasImportant = importantComponents.some((c) => successful.includes(c));
        if (hasImportant) {
            confidence = Math.min(100, confidence + 5);
        }
        // Penalty untuk kegagalan komponen penting
        const failedImportant = importantComponents.filter((c) => failed.includes(c));
        if (failedImportant.length > 0) {
            confidence = Math.max(0, confidence - failedImportant.length * 5);
        }
        return Math.round(confidence * 100) / 100;
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache = null;
        this.cacheTimestamp = 0;
        if (this.config.debug) {
            console.log("[IFFingerprint] Cache cleared");
        }
    }
    /**
     * Update konfigurasi
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        this.clearCache();
        if (this.config.debug) {
            console.log("[IFFingerprint] Config updated:", this.config);
        }
    }
    /**
     * Get versi library
     */
    getVersion() {
        return IFFINGERPRINT_VERSION;
    }
    /**
     * Get konfigurasi saat ini
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Enable/disable collector tertentu
     */
    setCollectorEnabled(name, enabled) {
        if (this.config.collectors.hasOwnProperty(name)) {
            this.config.collectors[name] = enabled;
            this.clearCache();
            if (this.config.debug) {
                console.log(`[IFFingerprint] Collector ${name} ${enabled ? "enabled" : "disabled"}`);
            }
        }
    }
    /**
     * Check jika collector enabled
     */
    isCollectorEnabled(name) {
        return this.config.collectors[name] || false;
    }
    /**
     * Get daftar semua collectors
     */
    getCollectors() {
        return Object.keys(this.collectors);
    }
    /**
     * Get daftar collectors yang enabled
     */
    getEnabledCollectors() {
        return Object.entries(this.collectors)
            .filter(([name]) => this.isCollectorEnabled(name))
            .map(([name]) => name);
    }
    /**
     * Compare dua fingerprint
     */
    static compare(fp1, fp2) {
        return fp1 === fp2;
    }
    /**
     * Calculate similarity antara dua fingerprint (untuk fuzzy matching)
     */
    static similarity(fp1, fp2) {
        if (fp1 === fp2)
            return 100;
        if (!fp1 || !fp2)
            return 0;
        // Simple character-based similarity
        const longer = fp1.length > fp2.length ? fp1 : fp2;
        const shorter = fp1.length > fp2.length ? fp2 : fp1;
        if (longer.length === 0)
            return 100;
        const editDistance = this.levenshteinDistance(longer, shorter);
        const similarity = ((longer.length - editDistance) / longer.length) * 100;
        return Math.round(similarity * 100) / 100;
    }
    /**
     * Levenshtein distance untuk similarity calculation
     */
    static levenshteinDistance(str1, str2) {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                }
            }
        }
        return matrix[str2.length][str1.length];
    }
}
/**
 * Export default instance
 */
export default IFFingerprint;
//# sourceMappingURL=IFFingerprintEngine.js.map