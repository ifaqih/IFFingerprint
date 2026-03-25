# Changelog

Semua perubahan penting pada project IFFingerprint akan didokumentasikan di file ini.

## [1.0.0] - 2026-03-23

### ✨ Added

- **128-bit Hash Algorithm**
  - Upgrade dari 32-bit ke 128-bit hash (32 karakter hex)
  - Menggunakan 4 × MurmurHash3-32 dengan seed berbeda
  - Collision risk sangat rendah (~0% untuk 1 miliar fingerprints)
  - Format: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (tanpa separator)

- **18 Fingerprint Collectors**
  - Navigator Collector - Browser navigator API
  - Screen Collector - Display properties
  - Canvas Collector - Canvas rendering fingerprint
  - WebGL Collector - GPU dan driver info
  - Audio Collector - AudioContext fingerprint
  - Fonts Collector - Installed fonts detection
  - Hardware Collector - CPU, memory, media devices, battery
  - Browser Collector - Browser & engine detection
  - Timezone Collector - Timezone info
  - Language Collector - Browser languages
  - Platform Collector - Operating system
  - Touch Collector - Touch capabilities
  - Connection Collector - Network information
  - Permissions Collector - Supported permissions
  - Storage Collector - Storage capabilities
  - CSS Collector - Advanced CSS feature detection
  - Math Collector - Math precision testing
  - Speech Collector - Web Speech API voices

- **Core Features**
  - IFFingerprint Engine dengan caching
  - Confidence score calculation
  - Component weighting system
  - Progress callback support
  - Debug mode
  - Collector enable/disable toggle

- **Utilities**
  - MurmurHash3 implementation
  - Hash combination functions
  - String normalization
  - Type guards

- **Documentation**
  - README.md dengan panduan lengkap
  - HASHING.md - Dokumentasi hashing detail
  - CHANGELOG.md - History perubahan
  - API reference lengkap

- **Demo Application**
  - Interactive demo page
  - Real-time fingerprint generation
  - Component visualization
  - Statistics display
  - Confidence meter
  - Copy to clipboard

### 🔧 Changed

- Hash output dari 8 karakter → 32 karakter
- Format fingerprint: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (tanpa separator)
- Improved collision resistance
- Enhanced uniqueness dengan multiple seed hashing

### 📦 Technical

- Zero dependencies (pure JavaScript/TypeScript)
- TypeScript support dengan full type definitions
- Modular architecture
- Browser-compatible (no Node.js dependencies)
- ~45KB minified library size

---

## Format Versi

Format: `[MAJOR] - YYYY-MM-DD`

- **MAJOR**: Perubahan breaking changes atau fitur besar
- **MINOR**: Fitur baru yang backward compatible
- **PATCH**: Bug fixes yang backward compatible

## Jenis Perubahan

- **Added**: Fitur baru
- **Changed**: Perubahan pada existing functionality
- **Deprecated**: Fitur yang akan dihapus
- **Removed**: Fitur yang dihapus
- **Fixed**: Bug fixes
- **Security**: Perbaikan keamanan

---

**Library Version**: 1.0.0  
**Total Commits**: Initial release  
**Contributors**: 1
