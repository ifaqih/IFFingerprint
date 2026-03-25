/**
 * Firefox Accuracy Test Script
 * Menguji efektivitas IFFingerprint pada Firefox
 */

let fingerprintInstance = null;
let lastResult = null;

// DOM Elements
const elements = {
  fingerprintDisplay: document.getElementById("fingerprintDisplay"),
  generateBtn: document.getElementById("generateBtn"),
  testAccuracyBtn: document.getElementById("testAccuracyBtn"),
  versionBadge: document.getElementById("versionBadge"),
  protectionNotice: document.getElementById("protectionNotice"),
  accuracyFill: document.getElementById("accuracyFill"),
  accuracyPercent: document.getElementById("accuracyPercent"),
  workingComponents: document.getElementById("workingComponents"),
  blockedComponents: document.getElementById("blockedComponents"),
  firefoxVersion: document.getElementById("firefoxVersion"),
  protectionLevel: document.getElementById("protectionLevel"),
  testResults: document.getElementById("testResults"),
  recommendations: document.getElementById("recommendations"),
};

/**
 * Initialize
 */
function init() {
  fingerprintInstance = new IFFingerprint({
    cacheEnabled: false,
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
      permissions: false,
      mediaDevices: false,
      storage: true,
    },
  });

  elements.versionBadge.textContent = `v${fingerprintInstance.getVersion()}`;

  elements.generateBtn.addEventListener("click", generateFingerprint);
  elements.testAccuracyBtn.addEventListener("click", runAccuracyTest);

  // Auto-generate on load
  setTimeout(generateFingerprint, 500);
}

/**
 * Generate Fingerprint
 */
async function generateFingerprint() {
  setLoading(true);

  try {
    const result = await fingerprintInstance.generate({ force: true });
    lastResult = result;

    elements.fingerprintDisplay.textContent = formatFingerprint(
      result.fingerprint,
    );

    // Show protection notice if Firefox
    if (isFirefox()) {
      elements.protectionNotice.style.display = "block";
    }
  } catch (error) {
    console.error("Error:", error);
    elements.fingerprintDisplay.textContent = "Error generating fingerprint";
  } finally {
    setLoading(false);
  }
}

/**
 * Run Accuracy Test
 */
async function runAccuracyTest() {
  setLoading(true);

  const results = {
    firefox: {},
    components: {},
    accuracy: 0,
  };

  // Detect Firefox
  results.firefox = detectFirefox();
  elements.firefoxVersion.textContent =
    results.firefox.version || "Not Firefox";
  elements.protectionLevel.textContent = results.firefox.protectionLevel;

  if (results.firefox.isFirefox && results.firefox.protectionLevel !== "None") {
    elements.protectionNotice.style.display = "block";
  }

  // Test each component
  results.components = await testAllComponents();

  // Calculate accuracy
  results.accuracy = calculateAccuracy(results);

  // Display results
  displayTestResults(results);

  setLoading(false);
}

/**
 * Detect Firefox and Protection Level
 */
function detectFirefox() {
  const ua = navigator.userAgent;
  const isFirefox = /Firefox\/\d+/.test(ua);

  if (!isFirefox) {
    return {
      isFirefox: false,
      version: "N/A",
      protectionLevel: "None",
    };
  }

  const versionMatch = ua.match(/Firefox\/(\d+)/);
  const version = versionMatch ? versionMatch[1] : "Unknown";

  // Detect protection level based on version and settings
  let protectionLevel = "Standard";

  // Check for strict privacy settings indicators
  const isPrivate = isPrivateBrowsing();
  const hasCanvasProtection = testCanvasProtection();
  const hasWebGLProtection = testWebGLProtection();

  if (version >= 120 || hasCanvasProtection || hasWebGLProtection) {
    protectionLevel = "Strict";
  } else if (version >= 100) {
    protectionLevel = "Enhanced";
  }

  if (isPrivate) {
    protectionLevel = "Strict (Private Mode)";
  }

  return {
    isFirefox: true,
    version: `${version}.x`,
    protectionLevel,
    isPrivate,
    hasCanvasProtection,
    hasWebGLProtection,
  };
}

/**
 * Test All Components
 */
async function testAllComponents() {
  const components = {};

  // Navigator
  components.navigator = testNavigator();

  // Screen
  components.screen = testScreen();

  // Canvas
  components.canvas = await testCanvas();

  // WebGL
  components.webgl = await testWebGL();

  // Audio
  components.audio = await testAudio();

  // Fonts
  components.fonts = await testFonts();

  // Hardware
  components.hardware = testHardware();

  // Timezone
  components.timezone = testTimezone();

  // Language
  components.language = testLanguage();

  // Platform
  components.platform = testPlatform();

  // Storage
  components.storage = testStorage();

  return components;
}

/**
 * Individual Component Tests
 */

function testNavigator() {
  const nav = navigator;
  const issues = [];

  // Check if user agent is frozen
  const ua = nav.userAgent;
  const isFrozen = /Firefox\/\d+\.0/.test(ua);
  if (isFrozen) issues.push("User Agent frozen");

  // Check hardware concurrency
  if (nav.hardwareConcurrency && nav.hardwareConcurrency % 2 !== 0) {
    issues.push("Hardware concurrency may be rounded");
  }

  return {
    name: "Navigator",
    status: issues.length === 0 ? "pass" : "warn",
    issues,
    data: {
      userAgent: ua.substring(0, 50) + "...",
      language: nav.language,
      cores: nav.hardwareConcurrency,
    },
  };
}

function testScreen() {
  const screen = window.screen;
  const issues = [];

  // Check if resolution is rounded (multiple of 50 or 100)
  const isRounded = screen.width % 50 === 0 || screen.height % 50 === 0;
  if (isRounded) issues.push("Screen resolution may be rounded");

  return {
    name: "Screen",
    status: issues.length === 0 ? "pass" : "warn",
    issues,
    data: {
      resolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
    },
  };
}

async function testCanvas() {
  const issues = [];
  let status = "pass";

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return {
        name: "Canvas",
        status: "fail",
        issues: ["Canvas not supported"],
        data: {},
      };
    }

    canvas.width = 100;
    canvas.height = 100;
    ctx.fillStyle = "#f00";
    ctx.fillRect(0, 0, 100, 100);

    const dataUrl = canvas.toDataURL();

    // Check if canvas is blocked or returns default data
    if (dataUrl.includes("data:,") || dataUrl.length < 100) {
      issues.push("Canvas may be blocked");
      status = "fail";
    }

    return {
      name: "Canvas",
      status,
      issues,
      data: {
        available: true,
        dataUrlLength: dataUrl.length,
      },
    };
  } catch (error) {
    return {
      name: "Canvas",
      status: "fail",
      issues: [error.message],
      data: {},
    };
  }
}

async function testWebGL() {
  const issues = [];
  let status = "pass";

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      return {
        name: "WebGL",
        status: "fail",
        issues: ["WebGL not supported"],
        data: {},
      };
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    let renderer = "";

    if (debugInfo) {
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

      // Check if renderer is generic
      if (
        renderer.includes("Google SwiftShader") ||
        renderer.includes("llvmpipe")
      ) {
        issues.push("Software rendering detected");
        status = "warn";
      }
    } else {
      issues.push("Debug info not available");
      status = "warn";
    }

    return {
      name: "WebGL",
      status,
      issues,
      data: {
        available: true,
        renderer: renderer || "Unknown",
      },
    };
  } catch (error) {
    return {
      name: "WebGL",
      status: "fail",
      issues: [error.message],
      data: {},
    };
  }
}

function testCanvasProtection() {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    canvas.width = 1;
    canvas.height = 1;
    ctx.fillStyle = "#f00";
    ctx.fillRect(0, 0, 1, 1);

    const data = ctx.getImageData(0, 0, 1, 1).data;
    // Firefox protection may return default values
    return data[0] !== 255 || data[3] !== 255;
  } catch {
    return true;
  }
}

function testWebGLProtection() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) return false;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return true;

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return !renderer || renderer === "";
  } catch {
    return true;
  }
}

async function testAudio() {
  const issues = [];
  let status = "pass";

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return {
        name: "Audio",
        status: "fail",
        issues: ["AudioContext not supported"],
        data: {},
      };
    }

    const ctx = new AudioContext();

    return {
      name: "Audio",
      status,
      issues,
      data: {
        available: true,
        sampleRate: ctx.sampleRate,
        state: ctx.state,
      },
    };
  } catch (error) {
    return {
      name: "Audio",
      status: "fail",
      issues: [error.message],
      data: {},
    };
  }
}

async function testFonts() {
  const issues = [];
  let status = "pass";

  // Simple font detection test
  const testFonts = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
  ];
  const detected = [];

  const container = document.createElement("div");
  container.style.cssText =
    "position:absolute;left:-9999px;top:0;font-size:72px;";
  document.body.appendChild(container);

  for (const font of testFonts) {
    const span = document.createElement("span");
    span.style.fontFamily = `"${font}", monospace`;
    span.textContent = "mmmmmmmmmmlli";
    container.appendChild(span);
    const fontWidth = span.offsetWidth;
    container.removeChild(span);

    span.style.fontFamily = "monospace";
    container.appendChild(span);
    const baseWidth = span.offsetWidth;
    container.removeChild(span);

    if (fontWidth !== baseWidth) {
      detected.push(font);
    }
  }

  document.body.removeChild(container);

  if (detected.length < 2) {
    issues.push("Limited font detection");
    status = "warn";
  }

  return {
    name: "Fonts",
    status,
    issues,
    data: {
      detected: detected.length,
      fonts: detected,
    },
  };
}

function testHardware() {
  const nav = navigator;
  const issues = [];

  return {
    name: "Hardware",
    status: issues.length === 0 ? "pass" : "warn",
    issues,
    data: {
      cpuCores: nav.hardwareConcurrency || "Unknown",
      memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "Unknown",
      touchPoints: nav.maxTouchPoints,
    },
  };
}

function testTimezone() {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      name: "Timezone",
      status: "pass",
      issues: [],
      data: {
        timezone,
        offset: new Date().getTimezoneOffset(),
      },
    };
  } catch (error) {
    return {
      name: "Timezone",
      status: "fail",
      issues: [error.message],
      data: {},
    };
  }
}

function testLanguage() {
  const languages = navigator.languages || [navigator.language];

  return {
    name: "Language",
    status: "pass",
    issues: [],
    data: {
      primary: languages[0],
      count: languages.length,
    },
  };
}

function testPlatform() {
  const platform = navigator.platform;

  return {
    name: "Platform",
    status: "pass",
    issues: [],
    data: {
      platform,
      os: getOS(),
    },
  };
}

function testStorage() {
  const storage = {
    localStorage: false,
    sessionStorage: false,
    indexedDB: false,
  };

  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    storage.localStorage = true;
  } catch {}

  try {
    sessionStorage.setItem("test", "test");
    sessionStorage.removeItem("test");
    storage.sessionStorage = true;
  } catch {}

  try {
    storage.indexedDB = "indexedDB" in window;
  } catch {}

  const allWorking =
    storage.localStorage && storage.sessionStorage && storage.indexedDB;

  return {
    name: "Storage",
    status: allWorking ? "pass" : "warn",
    issues: allWorking ? [] : ["Some storage disabled"],
    data: storage,
  };
}

/**
 * Calculate Accuracy
 */
function calculateAccuracy(results) {
  const weights = {
    navigator: 5,
    screen: 5,
    canvas: 15,
    webgl: 15,
    audio: 10,
    fonts: 10,
    hardware: 10,
    timezone: 5,
    language: 5,
    platform: 5,
    storage: 5,
  };

  let totalWeight = 0;
  let obtainedWeight = 0;

  for (const [name, result] of Object.entries(results.components)) {
    const weight = weights[name] || 5;
    totalWeight += weight;

    if (result.status === "pass") {
      obtainedWeight += weight;
    } else if (result.status === "warn") {
      obtainedWeight += weight * 0.5;
    }
    // fail = 0
  }

  let accuracy = (obtainedWeight / totalWeight) * 100;

  // Adjust for Firefox protection level
  if (results.firefox.protectionLevel === "Strict") {
    accuracy = Math.max(0, accuracy - 10);
  } else if (results.firefox.protectionLevel === "Enhanced") {
    accuracy = Math.max(0, accuracy - 5);
  }

  return Math.round(accuracy);
}

/**
 * Display Test Results
 */
function displayTestResults(results) {
  // Update accuracy meter
  elements.accuracyFill.style.width = `${results.accuracy}%`;
  elements.accuracyPercent.textContent = `${results.accuracy}%`;

  // Count working/blocked
  const working = Object.values(results.components).filter(
    (r) => r.status === "pass",
  ).length;
  const blocked = Object.values(results.components).filter(
    (r) => r.status === "fail",
  ).length;
  const total = Object.keys(results.components).length;

  elements.workingComponents.textContent = `${working}/${total}`;
  elements.blockedComponents.textContent = `${blocked}/${total}`;

  // Display component results
  elements.testResults.innerHTML = Object.values(results.components)
    .map(
      (component) => `
      <div class="test-result ${component.status}">
        <div>
          <strong>${component.name}</strong>
          ${component.issues.length > 0 ? `<br><small style="color: #64748b;">${component.issues.join(", ")}</small>` : ""}
        </div>
        <span class="status-badge ${component.status}">${component.status.toUpperCase()}</span>
      </div>
    `,
    )
    .join("");

  // Display recommendations
  displayRecommendations(results);
}

/**
 * Display Recommendations
 */
function displayRecommendations(results) {
  const recommendations = [];

  if (results.components.canvas?.status === "fail") {
    recommendations.push({
      title: "Canvas Blocked",
      description:
        "Firefox memblokir canvas fingerprinting. Coba gunakan WebGL sebagai alternatif.",
    });
  }

  if (results.components.webgl?.status === "warn") {
    recommendations.push({
      title: "WebGL Limited",
      description:
        "Info WebGL dibatasi. Gunakan lebih banyak komponen lain untuk akurasi.",
    });
  }

  if (results.components.fonts?.status === "warn") {
    recommendations.push({
      title: "Font Detection Terbatas",
      description:
        "Firefox membatasi font detection. Gunakan komponen hardware untuk kompensasi.",
    });
  }

  if (results.firefox.protectionLevel === "Strict") {
    recommendations.push({
      title: "Protection Level Strict",
      description:
        "Firefox menggunakan proteksi ketat. Akurasi maksimum sekitar 75-85%.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Good!",
      description: "Semua komponen berfungsi dengan baik. Akurasi optimal.",
    });
  }

  elements.recommendations.innerHTML = recommendations
    .map(
      (rec) => `
      <div class="test-section">
        <strong>💡 ${rec.title}</strong>
        <p style="margin-top: 0.5rem; color: #64748b;">${rec.description}</p>
      </div>
    `,
    )
    .join("");
}

/**
 * Helper Functions
 */

function isFirefox() {
  return /Firefox\/\d+/.test(navigator.userAgent);
}

function isPrivateBrowsing() {
  // Simple detection for private browsing
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return false;
  } catch {
    return true;
  }
}

function getOS() {
  const ua = navigator.userAgent;
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  return "Unknown";
}

function formatFingerprint(fp) {
  if (!fp || fp.length < 8) return "????????????????????????????????";
  // Display as 32 character hash without separators
  return fp.toUpperCase();
}

function setLoading(loading) {
  elements.generateBtn.disabled = loading;
  elements.testAccuracyBtn.disabled = loading;
  elements.generateBtn.innerHTML = loading
    ? '<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;"></div> Loading...'
    : "🚀 Generate Fingerprint";
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
