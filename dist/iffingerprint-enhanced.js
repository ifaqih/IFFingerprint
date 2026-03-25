/**
 * IFFingerprint Library v1.1.0
 * Enhanced dengan CSS, Math, dan Speech Collectors
 * Untuk akurasi lebih tinggi pada Firefox dan browser privacy-focused
 */

// ============================================
// CSS COLLECTOR
// ============================================
class CSSCollector {
  constructor() {
    this.name = "css";
    this.enabled = true;
  }

  async collect() {
    const result = {
      supportedFeatures: [],
      fontSmoothing: "auto",
      scrollbarWidth: 0,
      touchAction: false,
      backdropFilter: false,
      clipPath: false,
      cssVariables: false,
      grid: false,
      subgrid: false,
      containerQueries: false,
      hash: "",
    };

    try {
      // Test CSS features
      result.supportedFeatures = this.testCSSFeatures();
      result.fontSmoothing = this.getFontSmoothing();
      result.scrollbarWidth = this.getScrollbarWidth();
      result.touchAction = this.testProperty("touchAction", "touch-action");
      result.backdropFilter = this.testProperty(
        "backdropFilter",
        "backdrop-filter",
      );
      result.clipPath = this.testProperty("clipPath", "clip-path");
      result.cssVariables = this.testCSSVariables();
      result.grid = this.testProperty("display", "grid", "grid");
      result.subgrid = this.testSubgrid();
      result.containerQueries = this.testContainerQueries();

      const hashData = JSON.stringify(result);
      result.hash = this.hashString(hashData);
    } catch (error) {
      // Silent mode - no warnings
      // console.warn("CSSCollector error:", error);
    }

    return result;
  }

  testCSSFeatures() {
    const features = [];
    const tests = [
      { name: "flexbox", prop: "display", value: "flex" },
      { name: "grid", prop: "display", value: "grid" },
      { name: "aspect-ratio", prop: "aspectRatio", value: "16/9" },
      { name: "gap", prop: "gap", value: "10px" },
      { name: "backdrop-filter", prop: "backdropFilter", value: "blur(10px)" },
      { name: "clip-path", prop: "clipPath", value: "circle(50%)" },
      { name: "css-variables", prop: "cssVariables", value: "var(--test)" },
    ];

    for (const test of tests) {
      if (this.testProperty(test.name, test.prop, test.value)) {
        features.push(test.name);
      }
    }

    return features;
  }

  testProperty(name, prop, value) {
    try {
      const el = document.createElement("div");
      const style = el.style;

      if (!value) {
        return prop in style;
      }

      const prefixes = ["", "-webkit-", "-moz-", "-ms-", "-o-"];

      for (const prefix of prefixes) {
        const prefixedProp = prefix + prop;
        const camelCaseProp = prefixedProp.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase(),
        );

        try {
          style[camelCaseProp] = value;
          if (style[camelCaseProp] === value || style.cssText.includes(value)) {
            return true;
          }
        } catch {}
      }

      return false;
    } catch {
      return false;
    }
  }

  getFontSmoothing() {
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;left:-9999px;font-size:14px;";
    el.textContent = "mm";
    document.body.appendChild(el);

    const computed = window.getComputedStyle(el);
    const smoothing = computed.fontSmooth || "auto";

    document.body.removeChild(el);
    return smoothing;
  }

  getScrollbarWidth() {
    const outer = document.createElement("div");
    outer.style.cssText =
      "position:absolute;left:-9999px;width:100px;height:100px;overflow:scroll;visibility:hidden;";

    const inner = document.createElement("div");
    inner.style.cssText = "width:100%;height:100%;";

    outer.appendChild(inner);
    document.body.appendChild(outer);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    document.body.removeChild(outer);
    return scrollbarWidth;
  }

  testCSSVariables() {
    try {
      const el = document.createElement("div");
      el.style.cssText = "--test: 10px;";
      document.body.appendChild(el);

      const computed = getComputedStyle(el);
      const hasVar = computed.getPropertyValue("--test") === "10px";

      document.body.removeChild(el);
      return hasVar;
    } catch {
      return false;
    }
  }

  testSubgrid() {
    try {
      const el = document.createElement("div");
      el.style.display = "grid";
      el.style.gridTemplateRows = "subgrid";
      return (
        el.style.gridTemplateRows === "subgrid" ||
        el.style.cssText.includes("subgrid")
      );
    } catch {
      return false;
    }
  }

  testContainerQueries() {
    try {
      const el = document.createElement("div");
      el.style.containerType = "inline-size";
      return (
        el.style.containerType === "inline-size" ||
        el.style.cssText.includes("inline-size")
      );
    } catch {
      return false;
    }
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
}

// ============================================
// MATH COLLECTOR
// ============================================
class MathCollector {
  constructor() {
    this.name = "math";
    this.enabled = true;
  }

  async collect() {
    const result = {
      floatPrecision: 0,
      sinValue: "",
      cosValue: "",
      tanValue: "",
      expValue: "",
      logValue: "",
      sqrtValue: "",
      powValue: "",
      atan2Value: "",
      hash: "",
    };

    try {
      result.floatPrecision = this.getFloatPrecision();
      result.sinValue = Math.sin(1).toFixed(20);
      result.cosValue = Math.cos(1).toFixed(20);
      result.tanValue = Math.tan(1).toFixed(20);
      result.expValue = Math.exp(1).toFixed(20);
      result.logValue = Math.log(2).toFixed(20);
      result.sqrtValue = Math.sqrt(2).toFixed(20);
      result.powValue = Math.pow(2, 0.5).toFixed(20);
      result.atan2Value = Math.atan2(1, 2).toFixed(20);

      const hashData = JSON.stringify(result);
      result.hash = this.hashString(hashData);
    } catch (error) {
      // Silent mode - no warnings
      // console.warn("MathCollector error:", error);
    }

    return result;
  }

  getFloatPrecision() {
    const base = 0.1;
    let precision = 0;

    for (let i = 0; i < 20; i++) {
      const divisor = Math.pow(10, i);
      const result = base / divisor;
      const back = result * divisor;

      if (Math.abs(back - base) < Number.EPSILON) {
        precision = i;
      } else {
        break;
      }
    }

    return precision;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
}

// ============================================
// SPEECH COLLECTOR
// ============================================
class SpeechCollector {
  constructor() {
    this.name = "speech";
    this.enabled = true;
  }

  async collect() {
    const result = {
      available: false,
      voices: [],
      voiceCount: 0,
      defaultVoice: null,
      languages: [],
      hash: "",
    };

    try {
      if (!window.speechSynthesis) {
        return result;
      }

      result.available = true;

      // Wait for voices to load
      await this.waitForVoices();

      const voices = window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        result.voices = voices.map(
          (v) => `${v.name}|${v.lang}|${v.gender || ""}`,
        );
        result.voiceCount = voices.length;

        const defaultVoice = voices.find((v) => v.default);
        if (defaultVoice) {
          result.defaultVoice = `${defaultVoice.name}|${defaultVoice.lang}`;
        }

        const langs = new Set(voices.map((v) => v.lang));
        result.languages = Array.from(langs);
      }

      const hashData = JSON.stringify(result);
      result.hash = this.hashString(hashData);
    } catch (error) {
      // Silent mode - no warnings
      // console.warn("SpeechCollector error:", error);
    }

    return result;
  }

  async waitForVoices() {
    return new Promise((resolve) => {
      if (window.speechSynthesis.getVoices().length > 0) {
        resolve();
        return;
      }

      window.speechSynthesis.onvoiceschanged = () => {
        resolve();
      };

      setTimeout(resolve, 1000);
    });
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
}

// ============================================
// UTILITY FUNCTIONS (dari existing code)
// ============================================

function hashString(str, seed = 0x9747b28c) {
  // Generate 4 x 32-bit hash dengan seed berbeda untuk total 128-bit
  const hash1 = murmurhash3_32(str, seed);
  const hash2 = murmurhash3_32(str, seed + 1);
  const hash3 = murmurhash3_32(str, seed + 2);
  const hash4 = murmurhash3_32(str, seed + 3);

  const combined =
    (hash1 >>> 0).toString(16).padStart(8, "0") +
    (hash2 >>> 0).toString(16).padStart(8, "0") +
    (hash3 >>> 0).toString(16).padStart(8, "0") +
    (hash4 >>> 0).toString(16).padStart(8, "0");

  return combined;
}

function murmurhash3_32(key, seed = 0) {
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

  const remainder = len & 3;
  let k = 0;

  switch (remainder) {
    case 3:
      k ^= (key.charCodeAt(nBlocks * 4 + 2) & 0xff) << 16;
    case 2:
      k ^= (key.charCodeAt(nBlocks * 4 + 1) & 0xff) << 8;
    case 1:
      k ^= key.charCodeAt(nBlocks * 4) & 0xff;
      k = Math.imul(k, c1);
      k = (k << r1) | (k >>> (32 - r1));
      k = Math.imul(k, c2);
      hash ^= k;
  }

  hash ^= len;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  return hash >>> 0;
}

function combineHashes(hashes) {
  const combined = hashes.join(":");
  return hashString(combined);
}

// ============================================
// EXISTING COLLECTORS (dari previous code)
// ============================================
// [Semua collectors sebelumnya tetap ada di sini:
//  NavigatorCollector, ScreenCollector, CanvasCollector,
//  WebGLCollector, AudioCollector, FontsCollector,
//  HardwareCollector, BrowserCollector, TimezoneCollector,
//  LanguageCollector, PlatformCollector, TouchCollector,
//  ConnectionCollector, StorageCollector]

// ============================================
// MAIN ENGINE - UPDATED
// ============================================

const IFFINGERPRINT_VERSION = "1.1.0";

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
    permissions: false,
    mediaDevices: false,
    storage: true,
    behavioral: false,
    // Advanced collectors (NEW)
    css: true,
    math: true,
    speech: true,
  },
  cacheEnabled: true,
  cacheDuration: 300000,
  behavioralEnabled: false,
  debug: false, // DISABLED - no console output
};

// Updated weights dengan advanced collectors
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
  storage: 1,
  // Advanced collectors (NEW)
  css: 2,
  math: 2,
  speech: 2,
};

class IFFingerprint {
  constructor(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = null;
    this.cacheTimestamp = 0;
    this.initializeCollectors();

    // Debug mode disabled by default - no console output
    // if (this.config.debug) {
    //   console.log('[IFFingerprint] Initialized with config:', this.config);
    // }
  }

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
      storage: new StorageCollector(),
      // Advanced collectors (NEW)
      css: new CSSCollector(),
      math: new MathCollector(),
      speech: new SpeechCollector(),
    };
  }

  async generate(options = {}) {
    const startTime = performance.now();

    if (!options.force && this.config.cacheEnabled && this.isCacheValid()) {
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

    for (const [name, collector] of Object.entries(this.collectors)) {
      const isEnabled = this.config.collectors[name];

      if (!isEnabled) continue;

      try {
        if (this.config.debug) {
          console.log(`[IFFingerprint] Collecting ${name}...`);
        }

        const data = await collector.collect();
        components[name] = data;
        successfulComponents.push(name);

        if (data && typeof data === "object" && data.hash) {
          hashes.push(data.hash);
        } else {
          hashes.push(hashString(JSON.stringify(data)));
        }

        options.onProgress?.(name, "success");
      } catch (error) {
        // Silent mode - no warnings in console
        // console.warn(`[IFFingerprint] Error collecting ${name}:`, error);
        failedComponents.push(name);
        options.onProgress?.(name, "error");
      }
    }

    const fingerprint = combineHashes(hashes);
    const confidence = this.calculateConfidence(
      successfulComponents,
      failedComponents,
    );

    const endTime = performance.now();
    const duration = endTime - startTime;

    const result = {
      fingerprint,
      components,
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

  async get() {
    const result = await this.generate();
    return result.fingerprint;
  }

  async getComponents() {
    const result = await this.generate();
    return result.components;
  }

  isCacheValid() {
    if (!this.cache) return false;
    const age = Date.now() - this.cacheTimestamp;
    return age < this.config.cacheDuration;
  }

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

    if (totalWeight === 0) return 0;

    let confidence = (obtainedWeight / totalWeight) * 100;

    const importantComponents = [
      "canvas",
      "webgl",
      "audio",
      "fonts",
      "css",
      "math",
    ];
    const hasImportant = importantComponents.some((c) =>
      successful.includes(c),
    );
    if (hasImportant) {
      confidence = Math.min(100, confidence + 5);
    }

    const failedImportant = importantComponents.filter((c) =>
      failed.includes(c),
    );
    if (failedImportant.length > 0) {
      confidence = Math.max(0, confidence - failedImportant.length * 5);
    }

    return Math.round(confidence * 100) / 100;
  }

  clearCache() {
    this.cache = null;
    this.cacheTimestamp = 0;

    if (this.config.debug) {
      console.log("[IFFingerprint] Cache cleared");
    }
  }

  updateConfig(config) {
    this.config = { ...this.config, ...config };
    this.clearCache();

    if (this.config.debug) {
      console.log("[IFFingerprint] Config updated:", this.config);
    }
  }

  getVersion() {
    return IFFINGERPRINT_VERSION;
  }

  getConfig() {
    return { ...this.config };
  }

  setCollectorEnabled(name, enabled) {
    if (this.config.collectors.hasOwnProperty(name)) {
      this.config.collectors[name] = enabled;
      this.clearCache();

      if (this.config.debug) {
        console.log(
          `[IFFingerprint] Collector ${name} ${enabled ? "enabled" : "disabled"}`,
        );
      }
    }
  }

  isCollectorEnabled(name) {
    return this.config.collectors[name] || false;
  }

  getCollectors() {
    return Object.keys(this.collectors);
  }

  getEnabledCollectors() {
    return Object.entries(this.collectors)
      .filter(([name]) => this.isCollectorEnabled(name))
      .map(([name]) => name);
  }

  static compare(fp1, fp2) {
    return fp1 === fp2;
  }

  static similarity(fp1, fp2) {
    if (fp1 === fp2) return 100;
    if (!fp1 || !fp2) return 0;

    const longer = fp1.length > fp2.length ? fp1 : fp2;
    const shorter = fp1.length > fp2.length ? fp2 : fp1;

    if (longer.length === 0) return 100;

    const editDistance = this.levenshteinDistance(longer, shorter);
    const similarity = ((longer.length - editDistance) / longer.length) * 100;

    return Math.round(similarity * 100) / 100;
  }

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
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}

// ============================================
// EXPORT
// ============================================

if (typeof window !== "undefined") {
  window.IFFingerprint = IFFingerprint;
  window.IFFINGERPRINT_VERSION = IFFINGERPRINT_VERSION;
}
