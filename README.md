# 🔐 IFFingerprint

**Library Fingerprinting Browser dengan Akurasi Tinggi untuk JavaScript/TypeScript**

IFFingerprint adalah library fingerprinting browser yang komprehensif dan ringan, dirancang untuk mengidentifikasi pengguna browser secara unik dengan akurasi 90-100%. Library ini menggunakan berbagai teknik fingerprinting modern tanpa bergantung pada library eksternal.

## ✨ Fitur Utama

- 🎯 **Akurasi Tinggi** - Menggunakan 19 collectors fingerprinting (18 aktif + 1 experimental)
- 🚀 **Ringan** - Zero dependencies, murni JavaScript/TypeScript
- 🔒 **Privacy-Aware** - Tidak menggunakan cookie atau storage permanen
- 📦 **Modular** - Struktur kode yang rapi dan mudah dikustomisasi
- 🛡️ **Browser Friendly** - Dapat berjalan pada browser dengan kebijakan ketat
- 📊 **Confidence Score** - Score kepercayaan 0-100 untuk setiap fingerprint
- ⚡ **Performa** - Caching built-in + optimized collectors (60-70% faster!)
- 🔐 **128-bit Hash** - Fingerprint 32 karakter hex dengan collision risk ~0%
- ✅ **Stable** - Fingerprint konsisten meskipun window browser di-resize

## 📦 Instalasi

### Menggunakan NPM

```bash
npm install iffingerprint
```

### Menggunakan Yarn

```bash
yarn add iffingerprint
```

### CDN

```html
<script type="module">
  import { IFFingerprint } from "https://cdn.jsdelivr.net/npm/iffingerprint/dist/index.js";
</script>
```

### Download Manual

Download file dari repository dan include dalam project Anda.

## 🚀 Quick Start

### Basic Usage

```javascript
import { IFFingerprint } from "iffingerprint";

// Create instance
const fp = new IFFingerprint();

// Generate fingerprint
fp.generate().then((result) => {
  console.log("Fingerprint:", result.fingerprint);
  console.log("Confidence:", result.confidence);
  console.log("Components:", result.components);
});

// Atau gunakan shortcut
fp.get().then((hash) => {
  console.log("Fingerprint hash:", hash);
  // Output: "3F18A8079B2C4D1E8F5A6E3D7C9B1A4F" (32 karakter hex)
});
```

### Dengan Konfigurasi

```javascript
const fp = new IFFingerprint({
  cacheEnabled: true,
  cacheDuration: 300000, // 5 menit
  debug: false,
  collectors: {
    // Core collectors (Weight: 3)
    canvas: true,
    webgl: true,

    // High impact collectors (Weight: 2)
    audio: true,
    fonts: true,
    hardware: true,
    browser: true,
    timezone: true,
    language: true,
    platform: true,
    touch: true,
    connection: true,
    storage: true,
    css: true,
    math: true,
    speech: true,

    // Standard collectors (Weight: 1)
    navigator: true,
    screen: true,

    // Permission-based (requires user consent)
    permissions: false, // ⚠️ Requires permission
    mediaDevices: false, // ⚠️ Requires permission
    behavioral: false, // ⏳ Not yet implemented
  },
});

const result = await fp.generate();
```

## 📖 API Documentation

### Class: IFFingerprint

#### Constructor

```typescript
new IFFingerprint(config?: Partial<IFFingerprintConfig>)
```

**Parameters:**

- `config` - Konfigurasi opsional

**Example:**

```javascript
const fp = new IFFingerprint({
  cacheEnabled: true,
  debug: false,
});
```

### Methods

#### `generate(options?)`

Generate fingerprint lengkap dengan semua komponen.

```typescript
async generate(options?: GenerateOptions): Promise<FingerprintResult>
```

**Parameters:**

- `options.force` - Force regenerate meskipun cache ada
- `options.onProgress` - Callback untuk progress tracking

**Returns:** `Promise<FingerprintResult>`

**Example:**

```javascript
const result = await fp.generate({
  force: true,
  onProgress: (component, status) => {
    console.log(`${component}: ${status}`);
  },
});
```

#### `get()`

Shortcut untuk mendapatkan hash fingerprint saja.

```typescript
async get(): Promise<string>
```

**Returns:** `Promise<string>`

**Example:**

```javascript
const hash = await fp.get();
console.log(hash); // "a1b2c3d4e5f6"
```

#### `getComponents()`

Mendapatkan komponen fingerprint tanpa hash.

```typescript
async getComponents(): Promise<FingerprintComponents>
```

**Returns:** `Promise<FingerprintComponents>`

#### `clearCache()`

Menghapus cache fingerprint.

```typescript
clearCache(): void
```

#### `updateConfig(config)`

Update konfigurasi saat ini.

```typescript
updateConfig(config: Partial<IFFingerprintConfig>): void
```

#### `setCollectorEnabled(name, enabled)`

Enable/disable collector tertentu.

```typescript
setCollectorEnabled(name: string, enabled: boolean): void
```

**Example:**

```javascript
fp.setCollectorEnabled("canvas", false);
fp.setCollectorEnabled("webgl", true);
```

#### `getVersion()`

Mendapatkan versi library.

```typescript
getVersion(): string
```

### Static Methods

#### `IFFingerprint.compare(fp1, fp2)`

Compare dua fingerprint.

```typescript
static compare(fp1: string, fp2: string): boolean
```

**Example:**

```javascript
const isSame = IFFingerprint.compare(hash1, hash2);
```

#### `IFFingerprint.similarity(fp1, fp2)`

Calculate similarity antara dua fingerprint.

```typescript
static similarity(fp1: string, fp2: string): number
```

**Returns:** Percentage (0-100)

## 📊 Fingerprint Components

IFFingerprint mengumpulkan data dari **19 sumber** (18 aktif + 1 experimental):

| Component        | Deskripsi                                      | Weight | Performance |
| ---------------- | ---------------------------------------------- | ------ | ----------- |
| **Canvas**       | Canvas rendering untuk GPU & driver            | 3      | 10-20ms     |
| **WebGL**        | WebGL renderer dan extensions                  | 3      | 8-15ms      |
| **Audio**        | AudioContext processing fingerprint            | 2      | 5-10ms      |
| **Fonts**        | Font yang terinstall di sistem (100+ fonts)    | 2      | 15-30ms     |
| **Hardware**     | CPU cores, memory, battery, media devices      | 2      | 5-15ms      |
| **CSS**          | CSS feature detection                          | 2      | 5-10ms      |
| **Math**         | Math precision testing                         | 2      | 2-5ms       |
| **Speech**       | Web Speech API voices                          | 2      | 10-30ms     |
| **Navigator**    | Navigator API (userAgent, language, dll)       | 1      | 1-5ms       |
| **Screen**       | Screen resolution dan properties               | 1      | 1-3ms       |
| **Browser**      | Browser detection dan engine                   | 1      | 5-10ms      |
| **Timezone**     | Timezone dan offset                            | 1      | 1-3ms       |
| **Language**     | Browser language preferences                   | 1      | 1-3ms       |
| **Platform**     | Operating system detection                     | 1      | 1-3ms       |
| **Touch**        | Touch support dan capabilities                 | 1      | 1-3ms       |
| **Connection**   | Network connection info                        | 1      | 1-3ms       |
| **Storage**      | Storage capabilities                           | 1      | 1-3ms       |
| **Permissions**  | Supported permissions (⚠️ requires permission) | 1      | 1-3ms       |
| **MediaDevices** | Audio/video devices (⚠️ requires permission)   | 2      | 5-15ms      |
| **Behavioral**   | Mouse/typing patterns (⏳ experimental)        | 2      | N/A         |

**Total:** 19 collectors (18 aktif, 1 experimental)

## 🔧 Konfigurasi

### IFFingerprintConfig

```typescript
interface IFFingerprintConfig {
  // Enable/disable collectors
  collectors: CollectorsConfig;

  // Cache settings
  cacheEnabled: boolean;
  cacheDuration: number; // milliseconds

  // Behavioral tracking (experimental)
  behavioralEnabled: boolean;

  // Debug mode
  debug: boolean;
}
```

### CollectorsConfig

```typescript
interface CollectorsConfig {
  // Core collectors (Weight: 3)
  canvas: boolean;
  webgl: boolean;

  // High impact collectors (Weight: 2)
  audio: boolean;
  fonts: boolean;
  hardware: boolean;
  browser: boolean;
  timezone: boolean;
  language: boolean;
  platform: boolean;
  touch: boolean;
  connection: boolean;
  storage: boolean;
  css: boolean; // ✅ Advanced CSS feature detection
  math: boolean; // ✅ Math precision testing
  speech: boolean; // ✅ Web Speech API voices

  // Standard collectors (Weight: 1)
  navigator: boolean;
  screen: boolean;

  // Permission-based (requires user consent)
  permissions: boolean; // ⚠️ Requires permission
  mediaDevices: boolean; // ⚠️ Requires permission

  // Experimental
  behavioral: boolean; // ⏳ Not yet implemented
}
```

## 📁 Struktur Project

```
IFFingerprint/
├── src/
│   ├── types/           # TypeScript types & interfaces
│   │   └── index.ts
│   ├── core/            # Main engine
│   │   ├── IFFingerprintEngine.ts
│   │   └── index.ts
│   ├── collectors/      # Fingerprint collectors (19 total)
│   │   # Core collectors (Weight: 3)
│   │   ├── CanvasCollector.ts
│   │   ├── WebGLCollector.ts
│   │   # High impact collectors (Weight: 2)
│   │   ├── AudioCollector.ts
│   │   ├── FontsCollector.ts
│   │   ├── HardwareCollector.ts
│   │   ├── BrowserCollector.ts
│   │   ├── TimezoneCollector.ts
│   │   ├── LanguageCollector.ts
│   │   ├── PlatformCollector.ts
│   │   ├── TouchCollector.ts
│   │   ├── ConnectionCollector.ts
│   │   ├── StorageCollector.ts
│   │   ├── CSSCollector.ts           # ✅ Advanced CSS
│   │   ├── MathCollector.ts          # ✅ Math precision
│   │   ├── SpeechCollector.ts        # ✅ Web Speech API
│   │   # Standard collectors (Weight: 1)
│   │   ├── NavigatorCollector.ts
│   │   ├── ScreenCollector.ts
│   │   # Permission-based
│   │   ├── PermissionsCollector.ts
│   │   ├── MediaDevicesCollector.ts
│   │   # Experimental
│   │   └── BehavioralCollector.ts    # ⏳ Not implemented
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── hash.ts
│   │   ├── normalize.ts
│   │   ├── guards.ts
│   │   └── index.ts
│   └── index.ts         # Main entry point
├── demo/                # Demo application
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── production.html  # Production mode demo
├── dist/                # Compiled output
├── tsconfig.json
├── package.json
├── README.md
├── CONFIGURATION_GUIDE.md       # ✅ Detailed config guide
├── PERFORMANCE_OPTIMIZATION.md  # ✅ Performance guide
└── MAXIMUM_ACCURACY_COMPLETE.md # ✅ Accuracy optimization
```

## 🎯 Use Cases

### 1. Fraud Detection

```javascript
const fp = new IFFingerprint();
const hash = await fp.get();

// Simpan hash untuk deteksi akun ganda
await saveToDatabase(userId, hash);

// Check untuk suspicious activity
const existingUser = await checkExistingHash(hash);
if (existingUser && existingUser !== userId) {
  alert("Suspicious activity detected!");
}
```

### 2. Analytics & Tracking

```javascript
const fp = new IFFingerprint();
const { fingerprint, components } = await fp.generate();

// Track unique visitors
analytics.track("page_view", {
  fingerprint: fingerprint,
  browser: components.browser.name,
  platform: components.platform.name,
  screen: `${components.screen.width}x${components.screen.height}`,
});
```

### 3. Session Security

```javascript
const fp = new IFFingerprint();
const initialHash = await fp.get();

// Validate fingerprint saat sensitive action
async function validateSession() {
  const currentHash = await fp.get();
  if (!IFFingerprint.compare(initialHash, currentHash)) {
    // Session mungkin compromised
    logout();
  }
}
```

### 4. Rate Limiting

```javascript
const requestCounts = new Map();

async function checkRateLimit() {
  const fp = new IFFingerprint();
  const hash = await fp.get();

  const count = requestCounts.get(hash) || 0;
  if (count > 100) {
    throw new Error("Rate limit exceeded");
  }

  requestCounts.set(hash, count + 1);
}
```

## 🧪 Running Demo

1. Build library:

```bash
npm run build
```

2. Start demo server:

```bash
npm run demo
```

3. Buka browser ke `http://localhost:8080`

## 🏗️ Build from Source

### Requirements

- Node.js >= 14
- npm >= 6

### Steps

1. Clone repository

```bash
git clone <repository-url>
cd IFFingerprint
```

2. Install dependencies

```bash
npm install
```

3. Build library

```bash
npm run build
```

4. Watch mode (development)

```bash
npm run build:watch
```

## 🔐 Privacy & Security

IFFingerprint dirancang dengan prinsip privacy-aware:

- ✅ **No Persistent Storage** - Tidak menyimpan data permanen
- ✅ **No External Requests** - Semua proses berjalan lokal
- ✅ **No Cookies** - Tidak menggunakan cookies
- ✅ **Transparent** - Semua data yang dikumpulkan dapat dilihat
- ✅ **User Control** - Dapat disable collectors tertentu

### Browser Compatibility

| Browser | Support    | Notes                         |
| ------- | ---------- | ----------------------------- |
| Chrome  | ✅ Full    | Semua fitur                   |
| Firefox | ✅ Full    | Semua fitur                   |
| Safari  | ✅ Full    | Beberapa fitur terbatas       |
| Edge    | ✅ Full    | Semua fitur                   |
| Opera   | ✅ Full    | Semua fitur                   |
| Brave   | ⚠️ Partial | Canvas/WebGL mungkin diblokir |
| Tor     | ⚠️ Limited | Banyak fitur diblokir         |

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

**Made with ❤️ for the web community**
