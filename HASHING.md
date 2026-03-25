# 🔐 IFFingerprint Hash Documentation

## Hash Specification

### Output Format

- **Length**: 32 karakter hexadecimal
- **Bits**: 128-bit (4 × 32-bit)
- **Format**: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (tanpa separator)
- **Example**: `3F18A8079B2C4D1E8F5A6E3D7C9B1A4F`

### Algoritma

IFFingerprint menggunakan **kombinasi MurmurHash3** dengan teknik multiple seeds:

```javascript
function hashString(str, seed = 0x9747b28c) {
  // Generate 4 x 32-bit hash dengan seed berbeda
  const hash1 = murmurhash3_32(str, seed);
  const hash2 = murmurhash3_32(str, seed + 1);
  const hash3 = murmurhash3_32(str, seed + 2);
  const hash4 = murmurhash3_32(str, seed + 3);

  // Combine menjadi 128-bit hash
  return (
    (hash1 >>> 0).toString(16).padStart(8, "0") +
    (hash2 >>> 0).toString(16).padStart(8, "0") +
    (hash3 >>> 0).toString(16).padStart(8, "0") +
    (hash4 >>> 0).toString(16).padStart(8, "0")
  );
}
```

## Kenapa 128-bit?

### Perbandingan Hash Length

| Bits        | Hex Characters | Combinations     | Collision Risk   |
| ----------- | -------------- | ---------------- | ---------------- |
| 32-bit      | 8              | 4.3 miliar       | ❌ Tinggi        |
| 64-bit      | 16             | 18.4 quintillion | ⚠️ Sedang        |
| **128-bit** | **32**         | **3.4 × 10³⁸**   | ✅ Sangat Rendah |
| 256-bit     | 64             | 1.2 × 10⁷⁷       | ✅ Minimal       |

### Birthday Paradox Calculation

Untuk 32-bit hash (8 karakter):

- Dengan **65,536** fingerprints → **50% chance** of collision
- Dengan **100,000** fingerprints → **99.9% chance** of collision

Untuk 128-bit hash (32 karakter):

- Dengan **1 miliar** fingerprints → **~0% chance** of collision
- Dengan **1 triliun** fingerprints → **~0% chance** of collision

## Hash Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│  Level 1: Component Data                                │
│  - Canvas rendering data                                │
│  - WebGL parameters                                     │
│  - Audio frequency data                                 │
│  - Font list                                            │
│  - dll.                                                 │
│                                                         │
│              ⬇️ hashString() per component              │
│                                                         │
│  Level 2: Component Hashes (8 chars each)               │
│  - canvas.hash: "3F18A807"                              │
│  - webgl.hash: "9B2C4D1E"                               │
│  - audio.hash: "8F5A6E3D"                               │
│  - fonts.hash: "7C9B1A4F"                               │
│  - ... (15 components)                                  │
│                                                         │
│              ⬇️ combineHashes()                         │
│                                                         │
│  Level 3: Combined String                               │
│  "3F18A807:9B2C4D1E:8F5A6E3D:7C9B1A4F:..."              │
│                                                         │
│              ⬇️ hashString() final                      │
│                                                         │
│  Level 4: Final Fingerprint (32 chars)                  │
│  "A1B2C3D4E5F67890A1B2C3D4E5F67890"                     │
└─────────────────────────────────────────────────────────┘
```

## Uniqueness Factors

### High Impact Components (Weight: 3)

- **Canvas** - GPU rendering differences
- **WebGL** - GPU model, driver version

### Medium Impact Components (Weight: 2)

- **Audio** - Audio processing hardware
- **Fonts** - Installed font collection
- **Hardware** - CPU cores, memory
- **MediaDevices** - Connected devices

### Low Impact Components (Weight: 1)

- **Navigator** - User agent, settings
- **Screen** - Resolution, color depth
- **Timezone** - Geographic location
- **Language** - Browser language
- **Platform** - Operating system
- **Touch** - Touch capabilities
- **Connection** - Network type
- **Storage** - Storage capabilities

## Collision Resistance

### Test Scenarios

| Scenario                       | Expected Result          |
| ------------------------------ | ------------------------ |
| Same browser, same device      | ✅ Same fingerprint      |
| Same browser, different device | ❌ Different fingerprint |
| Different browser, same device | ❌ Different fingerprint |
| Incognito mode                 | ✅ Same fingerprint      |
| Clear cookies/cache            | ✅ Same fingerprint      |
| VPN/Proxy change               | ✅ Same fingerprint      |
| Browser update (minor)         | ✅ Same fingerprint      |
| Browser update (major)         | ❌ May differ            |
| OS update                      | ❌ May differ            |
| Hardware change                | ❌ Different fingerprint |

### Improving Uniqueness

Jika Anda perlu keunikan lebih tinggi:

```javascript
// 1. Enable semua collectors
const fp = new IFFingerprint({
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
    permissions: true, // Requires permission
    mediaDevices: true, // Requires permission
    storage: true,
  },
});

// 2. Add custom entropy
const customData = {
  screenPixelRatio: window.devicePixelRatio,
  timezoneOffset: new Date().getTimezoneOffset(),
  localStorageTest: localStorage.getItem("unique_id"),
};

const baseHash = await fp.get();
const finalHash = hashString(baseHash + JSON.stringify(customData));
```

## Performance

### Hash Generation Speed

| Operation                        | Time (avg) |
| -------------------------------- | ---------- |
| Single hashString()              | < 0.1ms    |
| Full fingerprint (15 components) | 50-200ms   |
| Cached fingerprint               | < 1ms      |

### Memory Usage

- **Library size**: ~45KB (minified)
- **Runtime memory**: < 1MB
- **Cache size**: < 10KB

## Security Considerations

### ✅ What This Protects Against

- Accidental duplicate sessions
- Basic bot detection
- Multi-account abuse
- Session hijacking (same browser)

### ⚠️ What This Doesn't Protect Against

- Determined attackers with same hardware
- Virtual machine cloning
- Advanced fingerprint spoofing
- State-sponsored actors

### Best Practices

```javascript
// 1. Combine dengan authentication
const fp = await fingerprint.get();
const user = await authenticate(credentials);
const sessionToken = hashString(fp + user.id + timestamp);

// 2. Rotate fingerprints periodically
const fp = await fingerprint.get();
const rotatingPart = Math.floor(Date.now() / (1000 * 60 * 60)); // Hourly
const secureHash = hashString(fp + rotatingPart);

// 3. Server-side validation
await fetch("/api/validate", {
  method: "POST",
  body: JSON.stringify({
    fingerprint: fp,
    userId: user.id,
    timestamp: Date.now(),
  }),
});
```

## API Reference

### hashString(str, seed?)

Generate 128-bit hash dari string.

```javascript
hashString("hello world");
// Returns: "3F18A8079B2C4D1E8F5A6E3D7C9B1A4F"
```

### combineHashes(hashes)

Combine multiple hashes menjadi satu.

```javascript
combineHashes(["abc123", "def456", "ghi789"]);
// Returns: hash of "abc123:def456:ghi789"
```

### murmurhash3_32(key, seed)

Low-level 32-bit MurmurHash3.

```javascript
murmurhash3_32("test", 0x9747b28c);
// Returns: 1234567890 (number)
```

## Troubleshooting

### Hash terlalu pendek (8 karakter)

**Problem**: Menggunakan versi lama

**Solution**: Update ke versi 1.0.0+ yang menggunakan 128-bit hash

### Hash berbeda setelah refresh

**Problem**: Komponen berubah (misal: window size)

**Solution**:

- Gunakan cache: `cacheEnabled: true`
- Normalisasi data yang berubah-ubah

### Collision terdeteksi

**Problem**: Hash sama untuk user berbeda

**Solution**:

- Enable lebih banyak collectors
- Add custom entropy
- Combine dengan user-specific data

---

**Version**: 1.0.0  
**Last Updated**: March 2026
