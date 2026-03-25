/**
 * IFFingerprint Demo Application
 * JavaScript untuk halaman demo
 */

// Global variables
let fingerprintInstance = null;
let lastResult = null;

// DOM Elements
const elements = {
  fingerprintDisplay: document.getElementById("fingerprintDisplay"),
  generateBtn: document.getElementById("generateBtn"),
  clearCacheBtn: document.getElementById("clearCacheBtn"),
  versionBadge: document.getElementById("versionBadge"),
  statusBadge: document.getElementById("statusBadge"),
  confidenceValue: document.getElementById("confidenceValue"),
  componentsValue: document.getElementById("componentsValue"),
  durationValue: document.getElementById("durationValue"),
  browserValue: document.getElementById("browserValue"),
  confidenceFill: document.getElementById("confidenceFill"),
  confidencePercent: document.getElementById("confidencePercent"),
  componentsList: document.getElementById("componentsList"),
  detailsGrid: document.getElementById("detailsGrid"),
  toast: document.getElementById("toast"),

  // Detail elements
  detailUserAgent: document.getElementById("detailUserAgent"),
  detailPlatform: document.getElementById("detailPlatform"),
  detailScreen: document.getElementById("detailScreen"),
  detailTimezone: document.getElementById("detailTimezone"),
  detailLanguage: document.getElementById("detailLanguage"),
  detailCpu: document.getElementById("detailCpu"),
  detailMemory: document.getElementById("detailMemory"),
  detailCanvas: document.getElementById("detailCanvas"),
  detailWebgl: document.getElementById("detailWebgl"),
  detailAudio: document.getElementById("detailAudio"),
  detailFonts: document.getElementById("detailFonts"),
  detailTouch: document.getElementById("detailTouch"),
};

/**
 * Initialize application
 */
function init() {
  // Create fingerprint instance - MAXIMUM ACCURACY CONFIGURATION
  fingerprintInstance = new IFFingerprint({
    cacheEnabled: true,
    cacheDuration: 600000, // 10 minutes (longer for stability)
    debug: false,
    collectors: {
      // ✅ ALL COLLECTORS ENABLED - Maximum entropy!

      // Core collectors (Weight: 3)
      canvas: true, // ✅ Highest weight
      webgl: true, // ✅ Highest weight

      // High impact collectors (Weight: 2)
      audio: true, // ✅ Audio fingerprinting
      fonts: true, // ✅ FULL font detection (100+ fonts)
      hardware: true, // ✅ Hardware info + battery
      browser: true, // ✅ Browser detection
      timezone: true, // ✅ Timezone info
      language: true, // ✅ Language preferences
      platform: true, // ✅ OS detection
      touch: true, // ✅ Touch capabilities
      connection: true, // ✅ Network info
      storage: true, // ✅ Storage capabilities
      css: true, // ✅ CSS feature detection
      math: true, // ✅ Math precision testing
      speech: true, // ✅ Web Speech API voices

      // Standard collectors (Weight: 1)
      navigator: true, // ✅ Navigator API
      screen: true, // ✅ Screen properties (FIXED for stability)

      // Permission-based (disabled by default)
      permissions: false, // ⚠️ Requires user permission
      mediaDevices: false, // ⚠️ Requires user permission
      behavioral: false, // ⏳ Not yet implemented
    },
  });

  // Set version badge
  elements.versionBadge.textContent = `v${fingerprintInstance.getVersion()}`;

  // Add event listeners
  elements.generateBtn.addEventListener("click", generateFingerprint);
  elements.clearCacheBtn.addEventListener("click", clearCache);
  elements.fingerprintDisplay.addEventListener("click", copyFingerprint);

  // Auto-generate on load
  setTimeout(generateFingerprint, 500);
}

/**
 * Generate fingerprint
 */
async function generateFingerprint() {
  setLoading(true);
  updateStatus("Generating...", "warning");

  try {
    const result = await fingerprintInstance.generate({
      force: false,
      onProgress: (component, status) => {
        console.log(`Component ${component}: ${status}`);
      },
    });

    lastResult = result;
    displayResult(result);
    updateStatus("Success", "success");
  } catch (error) {
    console.error("Error generating fingerprint:", error);
    updateStatus("Error", "error");
    elements.fingerprintDisplay.textContent = "Error generating fingerprint";
  } finally {
    setLoading(false);
  }
}

/**
 * Display result
 */
function displayResult(result) {
  // Display fingerprint
  elements.fingerprintDisplay.textContent = formatFingerprint(
    result.fingerprint,
  );

  // Display stats
  elements.confidenceValue.textContent = result.confidence;
  elements.componentsValue.textContent =
    result.metadata.successfulComponents.length;
  elements.durationValue.textContent = result.metadata.duration;
  elements.browserValue.textContent = result.metadata.browser;

  // Update confidence meter
  const confidencePercent = Math.min(100, result.confidence);
  elements.confidenceFill.style.width = `${confidencePercent}%`;
  elements.confidencePercent.textContent = `${Math.round(confidencePercent)}%`;

  // Display components
  displayComponents(result);

  // Display details
  displayDetails(result);
}

/**
 * Display components list
 */
function displayComponents(result) {
  const { successfulComponents, failedComponents } = result.metadata;

  const allComponents = [
    ...successfulComponents.map((name) => ({ name, status: "success" })),
    ...failedComponents.map((name) => ({ name, status: "error" })),
  ];

  elements.componentsList.innerHTML = allComponents
    .map(
      (component) => `
      <div class="component-item">
        <span class="component-name">${formatComponentName(component.name)}</span>
        <div class="component-status">
          <span class="status-indicator ${component.status}"></span>
          <span class="status-text">${component.status === "success" ? "Success" : "Failed"}</span>
        </div>
      </div>
    `,
    )
    .join("");
}

/**
 * Display detailed information
 */
function displayDetails(result) {
  const { components } = result;

  // Navigator
  elements.detailUserAgent.textContent = components.navigator?.userAgent || "-";

  // Platform
  elements.detailPlatform.textContent =
    `${components.platform?.name || "-"} ${components.platform?.version || ""}`.trim();

  // Screen
  elements.detailScreen.textContent = `${components.screen?.width} x ${components.screen?.height}`;

  // Timezone
  elements.detailTimezone.textContent = `${components.timezone?.name || "-"} (${components.timezone?.offsetString || ""})`;

  // Language
  elements.detailLanguage.textContent = components.language?.primary || "-";

  // Hardware
  elements.detailCpu.textContent = components.hardware?.cpuCores || "-";
  elements.detailMemory.textContent = components.hardware?.memory
    ? `${components.hardware.memory} GB`
    : "-";

  // Canvas
  elements.detailCanvas.textContent = components.canvas?.hash || "-";

  // WebGL
  elements.detailWebgl.textContent = components.webgl?.renderer || "-";

  // Audio
  elements.detailAudio.textContent = components.audio?.hash || "-";

  // Fonts
  elements.detailFonts.textContent = components.fonts?.detected?.length
    ? `${components.fonts.detected.length} fonts`
    : "-";

  // Touch
  elements.detailTouch.textContent = components.touch?.available
    ? `${components.touch.points} points`
    : "Not available";
}

/**
 * Format fingerprint for display
 */
function formatFingerprint(fp) {
  // Return as uppercase without separator
  return fp.toUpperCase();
}

/**
 * Format component name
 */
function formatComponentName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Set loading state
 */
function setLoading(loading) {
  elements.generateBtn.disabled = loading;
  elements.generateBtn.innerHTML = loading
    ? '<div class="spinner" style="width:16px;height:16px;border-width:2px;"></div> Generating...'
    : "🚀 Generate Fingerprint";
}

/**
 * Update status badge
 */
function updateStatus(status, type) {
  elements.statusBadge.textContent = status;
  elements.statusBadge.className = `card-badge ${type}`;
}

/**
 * Clear cache
 */
function clearCache() {
  fingerprintInstance.clearCache();
  showToast("Cache cleared!");
  elements.fingerprintDisplay.textContent = "????????????????????????????????";
  updateStatus("Ready", "success");
}

/**
 * Copy fingerprint to clipboard
 */
async function copyFingerprint() {
  if (!lastResult) {
    showToast("Generate fingerprint first!");
    return;
  }

  try {
    await navigator.clipboard.writeText(lastResult.fingerprint);
    showToast("Copied to clipboard!");
  } catch (error) {
    // Fallback untuk browser lama
    const textArea = document.createElement("textarea");
    textArea.value = lastResult.fingerprint;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast("Copied to clipboard!");
  }
}

/**
 * Show toast notification
 */
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 3000);
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
