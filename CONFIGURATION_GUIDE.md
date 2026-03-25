# 📚 IFFingerprint - Configuration Guide

## 🔧 Constructor Options

```javascript
const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 300000,
  debug: false,
  behavioralEnabled: false,
  collectors: { ... }
});
```

---

## 📋 Main Configuration Properties

### 1️⃣ `cacheEnabled` (boolean)

**Fungsi:** Mengaktifkan/menonaktifkan caching fingerprint

**Default:** `true`

**Cara Kerja:**
- Jika `true`: Hasil fingerprint disimpan di memory
- Generate berikutnya akan menggunakan cached result (lebih cepat)
- Cache berlaku selama `cacheDuration` milidetik

**Contoh:**
```javascript
// Dengan cache (cepat)
const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 300000, // 5 menit
});

await fp.generate(); // Generate pertama (lambat)
await fp.generate(); // Menggunakan cache (cepat)

// Tanpa cache (selalu generate baru)
const fp = new IFFingerprint({
  cacheEnabled: false,
});

await fp.generate(); // Selalu generate baru
```

**Use Cases:**
- ✅ `true` - User session tracking, analytics
- ❌ `false` - Security audit, testing, fingerprint stability research

---

### 2️⃣ `cacheDuration` (number)

**Fungsi:** Durasi cache dalam milidetik

**Default:** `300000` (5 menit)

**Contoh:**
```javascript
const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 60000,  // 1 menit
});

const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 3600000, // 1 jam
});

const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 86400000, // 24 jam
});
```

**Recommendations:**
| Duration | Use Case |
|----------|----------|
| `60000` (1 min) | High security, frequent changes |
| `300000` (5 min) | **Default** - Balanced |
| `900000` (15 min) | Standard web analytics |
| `3600000` (1 hour) | Long session tracking |
| `86400000` (24 hours) | Persistent user identification |

---

### 3️⃣ `debug` (boolean)

**Fungsi:** Mengaktifkan debug logging ke console

**Default:** `false`

**Output Debug:**
```javascript
const fp = new IFFingerprint({ debug: true });

// Console output:
// [IFFingerprint] Initialized with config: {...}
// [IFFingerprint] Generating new fingerprint
// [IFFingerprint] Collecting navigator...
// [IFFingerprint] Collecting screen...
// [IFFingerprint] Collecting canvas...
// ...
// [IFFingerprint] Fingerprint generated: { fingerprint, confidence, ... }
```

**Use Cases:**
- ✅ `true` - Development, debugging, troubleshooting
- ❌ `false` - **Production** (no console logs)

---

### 4️⃣ `behavioralEnabled` (boolean)

**Fungsi:** Mengaktifkan behavioral data collection (mouse movement, typing, scroll)

**Default:** `false`

**Note:** Feature ini masih dalam pengembangan (behavioral collector belum diimplementasikan)

**Future Use Cases:**
- ✅ `true` - Advanced fraud detection, bot detection
- ❌ `false` - Standard fingerprinting (recommended for now)

---

## 📦 Collectors Configuration

### Collector Properties

Setiap collector dapat di-enable/disable secara individual:

```javascript
collectors: {
  navigator: true,      // Browser navigator API
  screen: true,         // Display properties
  canvas: true,         // Canvas rendering fingerprint
  webgl: true,          // GPU dan driver info
  audio: true,          // AudioContext fingerprint
  fonts: true,          // Installed fonts detection
  hardware: true,       // CPU, memory, media devices, battery
  browser: true,        // Browser & engine detection
  timezone: true,       // Timezone info
  language: true,       // Browser languages
  platform: true,       // Operating system
  touch: true,          // Touch capabilities
  connection: true,     // Network information
  permissions: false,   // Requires user permission ⚠️
  mediaDevices: false,  // Requires user permission ⚠️
  storage: true,        // Storage capabilities
  behavioral: false,    // Not yet implemented
  css: true,            // Advanced CSS feature detection
  math: true,           // Math precision testing
  speech: true,         // Web Speech API voices
}
```

---

## 🔍 Detailed Collector Descriptions

### Core Collectors (High Impact)

#### `canvas` (boolean)
**Weight:** 3 (Highest)

**Data Collected:**
- Canvas rendering hash
- Text rendering fingerprint
- Emoji rendering fingerprint
- Geometry fingerprint
- Winding order

**Impact:** Sangat tinggi - GPU dan driver differences

**Recommendation:** ✅ Always enable

---

#### `webgl` (boolean)
**Weight:** 3 (Highest)

**Data Collected:**
- GPU vendor & renderer
- WebGL version
- Shading language version
- Supported extensions
- GPU parameters (bits, texture sizes, etc.)

**Impact:** Sangat tinggi - Unique GPU fingerprint

**Recommendation:** ✅ Always enable

---

#### `audio` (boolean)
**Weight:** 2 (High)

**Data Collected:**
- AudioContext fingerprint
- Sample rate
- Channel count
- Audio processing hash

**Impact:** Tinggi - Audio stack differences

**Recommendation:** ✅ Always enable

---

#### `fonts` (boolean)
**Weight:** 2 (High)

**Data Collected:**
- Installed fonts detection
- Font availability hash
- System fonts list

**Impact:** Tinggi - Font installation varies by user

**Recommendation:** ✅ Always enable

---

#### `hardware` (boolean)
**Weight:** 2 (High)

**Data Collected:**
- CPU cores (`navigator.hardwareConcurrency`)
- Device memory (`navigator.deviceMemory`)
- Touch points
- Pointer types
- Media devices count
- Battery status (level, charging)

**Impact:** Tinggi - Hardware differences

**Recommendation:** ✅ Always enable

---

### Standard Collectors (Medium Impact)

#### `navigator` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- User agent
- Language & languages
- Platform
- Vendor
- Cookie enabled
- Do not track
- PDF viewer enabled
- Hardware concurrency
- Device memory
- Max touch points

**Impact:** Medium - Common but still useful

**Recommendation:** ✅ Always enable

---

#### `screen` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- Screen resolution
- Available resolution
- Color depth
- Pixel depth
- Device pixel ratio
- Screen orientation
- Extended display info

**Impact:** Medium - Screen variations

**Recommendation:** ✅ Always enable

---

#### `browser` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- Browser name & version
- Browser major version
- Engine name & version
- Device type (mobile/tablet/desktop)
- Bot detection

**Impact:** Medium - Browser identification

**Recommendation:** ✅ Always enable

---

#### `timezone` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- Timezone name
- UTC offset
- Offset string
- DST status

**Impact:** Medium - Geographic indicator

**Recommendation:** ✅ Always enable

---

#### `language` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- Primary language
- All languages
- Language hash

**Impact:** Medium - User preference

**Recommendation:** ✅ Always enable

---

#### `platform` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- OS type
- OS name
- OS version
- Architecture

**Impact:** Medium - OS identification

**Recommendation:** ✅ Always enable

---

#### `touch` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- Touch support
- Max touch points
- Supported touch events

**Impact:** Medium - Device capability

**Recommendation:** ✅ Always enable

---

#### `connection` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- Connection type
- Effective connection type
- Downlink speed
- RTT (round trip time)
- Save data mode

**Impact:** Medium - Network fingerprint

**Recommendation:** ✅ Always enable

---

#### `storage` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- LocalStorage support
- SessionStorage support
- IndexedDB support
- Cookies support
- CacheStorage support
- File System Access support

**Impact:** Medium - Browser capabilities

**Recommendation:** ✅ Always enable

---

#### `css` (boolean)
**Weight:** 2 (High)

**Data Collected:**
- CSS feature support
- Font smoothing
- Scrollbar width
- Touch action support
- Backdrop filter support
- Clip path support
- CSS variables support
- Grid support
- Container queries support

**Impact:** Tinggi - Browser CSS engine differences

**Recommendation:** ✅ Enable for advanced fingerprinting

---

#### `math` (boolean)
**Weight:** 2 (High)

**Data Collected:**
- Float precision
- Math function results (sin, cos, tan, exp, log, sqrt, pow, atan2)
- Math hash

**Impact:** Tinggi - JavaScript engine precision differences

**Recommendation:** ✅ Enable for advanced fingerprinting

---

#### `speech` (boolean)
**Weight:** 2 (High)

**Data Collected:**
- Speech API availability
- Available voices
- Voice count
- Default voice
- Supported languages
- Voice hash

**Impact:** Tinggi - OS and browser voice differences

**Recommendation:** ✅ Enable for advanced fingerprinting

---

### Permission-Based Collectors (Require User Approval)

#### `permissions` (boolean)
**Weight:** 1 (Medium)

**Data Collected:**
- Supported permissions
- Permission states

**⚠️ Requires User Permission:** Yes

**Permission Required:**
```javascript
// Need to request permission first
const result = await navigator.permissions.query({ name: '...' });
```

**Recommendation:** ❌ Disable by default, enable only when needed

---

#### `mediaDevices` (boolean)
**Weight:** 2 (High)

**Data Collected:**
- Audio input devices count
- Audio output devices count
- Video input devices count
- Device IDs (hashed)

**⚠️ Requires User Permission:** Yes

**Permission Required:**
```javascript
// Need getUserMedia permission
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: true, 
  video: true 
});
```

**Recommendation:** ❌ Disable by default, enable only when needed

---

### Not Yet Implemented

#### `behavioral` (boolean)
**Weight:** 2 (High)

**Planned Data:**
- Mouse movement patterns
- Typing rhythm
- Scroll patterns

**Status:** ⏳ Not yet implemented

**Recommendation:** ❌ Keep disabled

---

## 🎯 Configuration Presets

### 1. Production Mode (Recommended)

```javascript
const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 300000, // 5 minutes
  debug: false,
  behavioralEnabled: false,
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
    css: true,
    math: true,
    speech: true,
  },
});
```

---

### 2. Development/Debug Mode

```javascript
const fp = new IFFingerprint({
  cacheEnabled: false, // Always generate new
  cacheDuration: 0,
  debug: true, // Enable console logs
  behavioralEnabled: false,
  collectors: {
    // ... all true
  },
});
```

---

### 3. Minimal/Fast Mode

```javascript
const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 60000, // 1 minute
  debug: false,
  collectors: {
    navigator: true,
    screen: true,
    canvas: true,
    webgl: false, // Disable heavy collectors
    audio: false,
    fonts: false,
    hardware: true,
    browser: true,
    timezone: true,
    language: true,
    platform: true,
    touch: false,
    connection: false,
    permissions: false,
    mediaDevices: false,
    storage: false,
    behavioral: false,
    css: false,
    math: false,
    speech: false,
  },
});
```

---

### 4. Maximum Accuracy Mode

```javascript
const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 900000, // 15 minutes
  debug: false,
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
    permissions: false, // Still false (requires permission)
    mediaDevices: false, // Still false (requires permission)
    storage: true,
    behavioral: false,
    css: true,
    math: true,
    speech: true,
  },
});
```

---

### 5. Privacy-Focused Mode

```javascript
const fp = new IFFingerprint({
  cacheEnabled: false,
  debug: false,
  collectors: {
    navigator: true,
    screen: false, // Disable screen fingerprinting
    canvas: false, // Disable canvas fingerprinting
    webgl: false, // Disable WebGL fingerprinting
    audio: false, // Disable audio fingerprinting
    fonts: false, // Disable font fingerprinting
    hardware: true,
    browser: true,
    timezone: false, // Disable geographic indicators
    language: true,
    platform: true,
    touch: false,
    connection: false,
    permissions: false,
    mediaDevices: false,
    storage: false,
    behavioral: false,
    css: false,
    math: false,
    speech: false,
  },
});
```

---

## 📊 Collector Impact Summary

| Collector | Weight | Performance | Privacy Impact | Recommended |
|-----------|--------|-------------|----------------|-------------|
| canvas | 3 | Medium | High | ✅ Always |
| webgl | 3 | Medium | High | ✅ Always |
| audio | 2 | Low | Medium | ✅ Always |
| fonts | 2 | Medium | Medium | ✅ Always |
| hardware | 2 | Low | Low | ✅ Always |
| css | 2 | Low | Low | ✅ Advanced |
| math | 2 | Low | Low | ✅ Advanced |
| speech | 2 | Low | Low | ✅ Advanced |
| navigator | 1 | Low | Low | ✅ Always |
| screen | 1 | Low | Low | ✅ Always |
| browser | 1 | Low | Low | ✅ Always |
| timezone | 1 | Low | Medium | ✅ Always |
| language | 1 | Low | Low | ✅ Always |
| platform | 1 | Low | Low | ✅ Always |
| touch | 1 | Low | Low | ✅ Always |
| connection | 1 | Low | Medium | ✅ Always |
| storage | 1 | Low | Low | ✅ Always |
| permissions | 1 | Low | High | ⚠️ Permission |
| mediaDevices | 2 | Medium | High | ⚠️ Permission |
| behavioral | 2 | High | High | ❌ Not ready |

---

## 🔧 Generate Options

### `force` (boolean)

**Fungsi:** Force regenerate fingerprint, bypass cache

```javascript
const result = await fp.generate({
  force: true, // Ignore cache, always generate new
});
```

---

### `config` (Partial<IFFingerprintConfig>)

**Fungsi:** Override configuration for this generate call

```javascript
const result = await fp.generate({
  config: {
    debug: true, // Override debug for this call only
  },
});
```

---

### `onProgress` (callback)

**Fungsi:** Callback untuk setiap collector progress

```javascript
const result = await fp.generate({
  onProgress: (component, status) => {
    console.log(`${component}: ${status}`);
    // Output: "canvas: success"
    // Output: "webgl: success"
    // Output: "audio: error"
  },
});
```

---

## 📝 Quick Reference

```javascript
// Default configuration
const DEFAULT_CONFIG = {
  cacheEnabled: true,           // Enable caching
  cacheDuration: 300000,        // 5 minutes
  debug: false,                 // Production mode
  behavioralEnabled: false,     // Not yet implemented
  collectors: {
    // Core (High Impact)
    canvas: true,
    webgl: true,
    audio: true,
    fonts: true,
    hardware: true,
    
    // Standard (Medium Impact)
    navigator: true,
    screen: true,
    browser: true,
    timezone: true,
    language: true,
    platform: true,
    touch: true,
    connection: true,
    storage: true,
    
    // Advanced (High Impact)
    css: true,
    math: true,
    speech: true,
    
    // Permission-based (Disabled by default)
    permissions: false,
    mediaDevices: false,
    
    // Not yet implemented
    behavioral: false,
  },
};
```

---

**Created:** March 25, 2026
**Version:** 1.0.0
**Status:** Complete Documentation ✅
