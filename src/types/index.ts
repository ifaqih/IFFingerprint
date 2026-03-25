/**
 * IFFingerprint Types
 * Definisi tipe data untuk library IFFingerprint
 */

/**
 * Hasil fingerprint lengkap
 */
export interface FingerprintResult {
  /** Hash fingerprint unik */
  fingerprint: string;
  /** Komponen-komponen fingerprint */
  components: FingerprintComponents;
  /** Metadata proses */
  metadata: FingerprintMetadata;
  /** Score kepercayaan */
  confidence: number;
}

/**
 * Komponen-komponen fingerprint
 */
export interface FingerprintComponents {
  // Navigator
  navigator: NavigatorData;
  // Screen
  screen: ScreenData;
  // Canvas
  canvas: CanvasData;
  // WebGL
  webgl: WebGLData;
  // Audio
  audio: AudioData;
  // Fonts
  fonts: FontsData;
  // Hardware
  hardware: HardwareData;
  // Browser
  browser: BrowserData;
  // Timezone
  timezone: TimezoneData;
  // Language
  language: LanguageData;
  // Platform
  platform: PlatformData;
  // Touch
  touch: TouchData;
  // Connection
  connection: ConnectionData;
  // Permissions
  permissions: PermissionsData;
  // Media Devices
  mediaDevices: MediaDevicesData;
  // Storage
  storage: StorageData;
  // Behavioral (opsional)
  behavioral?: BehavioralData;
  // Advanced collectors
  css: CSSData;
  math: MathData;
  speech: SpeechData;
}

/**
 * Metadata proses fingerprinting
 */
export interface FingerprintMetadata {
  /** Waktu pembuatan fingerprint */
  timestamp: number;
  /** Versi library */
  version: string;
  /** Durasi proses (ms) */
  duration: number;
  /** Komponen yang berhasil dikumpulkan */
  successfulComponents: string[];
  /** Komponen yang gagal dikumpulkan */
  failedComponents: string[];
  /** Browser yang terdeteksi */
  browser: string;
  /** Engine yang digunakan */
  engine: string;
}

/**
 * Data dari Navigator API
 */
export interface NavigatorData {
  userAgent: string;
  language: string;
  languages: string[];
  platform: string;
  vendor: string;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  hardwareConcurrency: number;
  deviceMemory: number;
  maxTouchPoints: number;
  pdfViewerEnabled: boolean;
  vendorSub: string;
  productSub: string;
  appVersion: string;
  appCodeName: string;
  appName: string;
  product: string;
  oscpu?: string | null;
  buildID?: string | null;
}

/**
 * Data dari Screen API
 */
export interface ScreenData {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
  availLeft: number | null;
  availTop: number | null;
  orientation?: {
    type: string;
    angle: number;
  };
  isExtended: boolean;
  screenHeight: number;
  screenWidth: number;
  y: number;
  x: number;
}

/**
 * Data dari Canvas fingerprinting
 */
export interface CanvasData {
  available: boolean;
  hash: string;
  geometry: string;
  text: string;
  emoji: string;
  winding: boolean;
  imageSmoothingEnabled: boolean;
}

/**
 * Data dari WebGL fingerprinting
 */
export interface WebGLData {
  available: boolean;
  vendor: string;
  renderer: string;
  version: string;
  shadingLanguageVersion: string;
  vendorUnmasked: string;
  rendererUnmasked: string;
  extensions: string[];
  parameters: WebGLParameters;
  hash: string;
}

export interface WebGLParameters {
  aliasedLineWidthRange: string;
  aliasedPointSizeRange: string;
  alphaBits: number;
  blueBits: number;
  depthBits: number;
  greenBits: number;
  maxCombinedTextureImageUnits: number;
  maxCubeMapTextureSize: number;
  maxFragmentUniformVectors: number;
  maxRenderbufferSize: number;
  maxTextureImageUnits: number;
  maxTextureMaxAnisotropy: number;
  maxTextureSize: number;
  maxVaryingVectors: number;
  maxVertexAttributes: number;
  maxVertexTextureImageUnits: number;
  maxVertexUniformVectors: number;
  redBits: number;
  stencilBits: number;
  subpixelBits: number;
}

/**
 * Data dari AudioContext fingerprinting
 */
export interface AudioData {
  available: boolean;
  hash: string;
  sampleRate: number;
  channelCount: number;
  state: string;
}

/**
 * Data dari font detection
 */
export interface FontsData {
  available: boolean;
  detected: string[];
  hash: string;
}

/**
 * Data hardware device
 */
export interface HardwareData {
  cpuCores: number;
  memory: number;
  touchPoints: number;
  pointerType: string[];
  mediaDevices: {
    audioInput: number;
    audioOutput: number;
    videoInput: number;
  };
  battery?: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  };
}

/**
 * Data browser detection
 */
export interface BrowserData {
  name: string;
  version: string;
  majorVersion: string;
  engine: string;
  engineVersion: string;
  isBot: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmartTV: boolean;
  isWearable: boolean;
  isConsole: boolean;
  isEmbedded: boolean;
}

/**
 * Data timezone
 */
export interface TimezoneData {
  name: string;
  offset: number;
  offsetString: string;
  abbreviation?: string;
  dst?: boolean;
}

/**
 * Data language
 */
export interface LanguageData {
  primary: string;
  all: string[];
  hash: string;
}

/**
 * Data platform
 */
export interface PlatformData {
  type: string;
  name: string;
  version: string;
  architecture: string;
}

/**
 * Data touch support
 */
export interface TouchData {
  available: boolean;
  points: number;
  events: string[];
}

/**
 * Data network connection
 */
export interface ConnectionData {
  available: boolean;
  type?: string;
  effectiveType?: string;
  downlink?: number;
  downlinkMax?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Data permissions
 */
export interface PermissionsData {
  available: boolean;
  supported: string[];
  states: Record<string, string>;
}

/**
 * Data media devices
 */
export interface MediaDevicesData {
  available: boolean;
  count: number;
  deviceIds: string[];
  kinds: Record<string, number>;
}

/**
 * Data storage capabilities
 */
export interface StorageData {
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  cookies: boolean;
  cacheStorage: boolean;
  fileSystemAccess: boolean;
}

/**
 * Data behavioral (opsional, untuk akurasi lebih tinggi)
 */
export interface BehavioralData {
  mouseMovement?: {
    pattern: string;
    speed: number;
  };
  typing?: {
    rhythm: string;
    speed: number;
  };
  scroll?: {
    pattern: string;
    speed: number;
  };
}

/**
 * Konfigurasi IFFingerprint
 */
export interface IFFingerprintConfig {
  /** Enable/disable collector tertentu */
  collectors: CollectorsConfig;
  /** Cache fingerprint untuk performa */
  cacheEnabled: boolean;
  /** Durasi cache (ms) */
  cacheDuration: number;
  /** Include data behavioral */
  behavioralEnabled: boolean;
  /** Log proses debugging */
  debug: boolean;
}

/**
 * Konfigurasi collectors
 */
export interface CollectorsConfig {
  navigator: boolean;
  screen: boolean;
  canvas: boolean;
  webgl: boolean;
  audio: boolean;
  fonts: boolean;
  hardware: boolean;
  browser: boolean;
  timezone: boolean;
  language: boolean;
  platform: boolean;
  touch: boolean;
  connection: boolean;
  permissions: boolean;
  mediaDevices: boolean;
  storage: boolean;
  behavioral: boolean;
  // Advanced collectors
  css: boolean;
  math: boolean;
  speech: boolean;
}

/**
 * Fungsi collector
 */
export type CollectorFunction<T> = () => Promise<T> | T;

/**
 * Interface untuk Collector
 */
export interface Collector<T> {
  name: string;
  collect: CollectorFunction<T>;
  enabled: boolean;
}

/**
 * Opsi untuk generate fingerprint
 */
export interface GenerateOptions {
  /** Override konfigurasi default */
  config?: Partial<IFFingerprintConfig>;
  /** Force regenerate meskipun cache ada */
  force?: boolean;
  /** Callback progress */
  onProgress?: (component: string, status: "success" | "error") => void;
}

/**
 * Data dari CSS feature detection
 */
export interface CSSData {
  supportedFeatures: string[];
  fontSmoothing: string;
  scrollbarWidth: number;
  touchAction: boolean;
  backdropFilter: boolean;
  clipPath: boolean;
  cssVariables: boolean;
  grid: boolean;
  subgrid: boolean;
  containerQueries: boolean;
  hash: string;
}

/**
 * Data dari Math precision testing
 */
export interface MathData {
  floatPrecision: number;
  sinValue: string;
  cosValue: string;
  tanValue: string;
  expValue: string;
  logValue: string;
  sqrtValue: string;
  powValue: string;
  atan2Value: string;
  hash: string;
}

/**
 * Data dari Web Speech API
 */
export interface SpeechData {
  available: boolean;
  voices: string[];
  voiceCount: number;
  defaultVoice: string | null;
  languages: string[];
  hash: string;
}
