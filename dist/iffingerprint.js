/**
 * IFFingerprint Library - Browser Bundle
 * Compiled version untuk direct browser usage
 */

(function (global) {
  "use strict";

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Hash Utilities
   * Menggunakan kombinasi multiple hash untuk menghasilkan 128-bit hash (32 karakter hex)
   */
  function hashString(str, seed = 0x9747b28c) {
    // Generate 4 x 32-bit hash dengan seed berbeda untuk total 128-bit
    const hash1 = murmurhash3_32(str, seed);
    const hash2 = murmurhash3_32(str, seed + 1);
    const hash3 = murmurhash3_32(str, seed + 2);
    const hash4 = murmurhash3_32(str, seed + 3);

    // Combine menjadi 128-bit hash (32 karakter hex)
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
  // COLLECTORS
  // ============================================

  /**
   * Navigator Collector
   */
  class NavigatorCollector {
    constructor() {
      this.name = "navigator";
      this.enabled = true;
    }

    collect() {
      const nav = navigator;

      return {
        userAgent: nav.userAgent || "",
        language: nav.language || "",
        languages: Array.from(nav.languages || []),
        platform: nav.platform || "",
        vendor: nav.vendor || "",
        cookieEnabled: nav.cookieEnabled,
        doNotTrack: nav.doNotTrack || null,
        hardwareConcurrency: nav.hardwareConcurrency || 0,
        deviceMemory: nav.deviceMemory || 0,
        maxTouchPoints: nav.maxTouchPoints || 0,
        pdfViewerEnabled: nav.pdfViewerEnabled || false,
        vendorSub: nav.vendorSub || "",
        productSub: nav.productSub || "",
        appVersion: nav.appVersion || "",
        appCodeName: nav.appCodeName || "",
        appName: nav.appName || "",
        product: nav.product || "",
        oscpu: nav.oscpu || null,
        buildID: nav.buildID || null,
      };
    }
  }

  /**
   * Screen Collector
   */
  class ScreenCollector {
    constructor() {
      this.name = "screen";
      this.enabled = true;
    }

    collect() {
      const screen = window.screen;
      const visualViewport = window.visualViewport;

      return {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        devicePixelRatio: window.devicePixelRatio,
        availLeft: screen.availLeft,
        availTop: screen.availTop,
        orientation: screen.orientation
          ? {
              type: screen.orientation.type,
              angle: screen.orientation.angle,
            }
          : undefined,
        isExtended: screen.isExtended || false,
        screenHeight: visualViewport?.height || screen.height,
        screenWidth: visualViewport?.width || screen.width,
        y: visualViewport?.offsetTop || 0,
        x: visualViewport?.offsetLeft || 0,
      };
    }
  }

  /**
   * Canvas Collector
   */
  class CanvasCollector {
    constructor() {
      this.name = "canvas";
      this.enabled = true;
    }

    async collect() {
      const result = {
        available: false,
        hash: "",
        geometry: "",
        text: "",
        emoji: "",
        winding: false,
        imageSmoothingEnabled: false,
      };

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return result;

        result.available = true;
        canvas.width = 200;
        canvas.height = 50;
        result.imageSmoothingEnabled = ctx.imageSmoothingEnabled;

        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("IFFingerprint 🏔️", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("IFFingerprint 🏔️", 4, 17);
        result.text = canvasToDataUrl(canvas);

        const canvas2 = document.createElement("canvas");
        const ctx2 = canvas2.getContext("2d");
        if (ctx2) {
          canvas2.width = 200;
          canvas2.height = 50;
          ctx2.fillStyle = "#EB5D5C";
          ctx2.beginPath();
          ctx2.arc(50, 25, 20, 0, Math.PI * 2, true);
          ctx2.arc(100, 25, 20, 0, Math.PI * 2, true);
          ctx2.arc(150, 25, 20, 0, Math.PI * 2, true);
          ctx2.fill();
          result.geometry = canvasToDataUrl(canvas2);
        }

        const canvas3 = document.createElement("canvas");
        const ctx3 = canvas3.getContext("2d");
        if (ctx3) {
          canvas3.width = 100;
          canvas3.height = 50;
          ctx3.font = "30px Arial";
          ctx3.textBaseline = "top";
          ctx3.fillText("🤔", 0, 0);
          result.emoji = canvasToDataUrl(canvas3);
        }

        const combined = result.text + result.geometry + result.emoji;
        result.hash = hashString(combined);
      } catch (error) {
        // Silent mode - no warnings
        // console.warn("CanvasCollector error:", error);
      }

      return result;
    }
  }

  function canvasToDataUrl(canvas) {
    try {
      return canvas.toDataURL();
    } catch {
      return "";
    }
  }

  /**
   * WebGL Collector
   */
  class WebGLCollector {
    constructor() {
      this.name = "webgl";
      this.enabled = true;
    }

    async collect() {
      const result = {
        available: false,
        vendor: "",
        renderer: "",
        version: "",
        shadingLanguageVersion: "",
        vendorUnmasked: "",
        rendererUnmasked: "",
        extensions: [],
        parameters: {
          aliasedLineWidthRange: "",
          aliasedPointSizeRange: "",
          alphaBits: 0,
          blueBits: 0,
          depthBits: 0,
          greenBits: 0,
          maxCombinedTextureImageUnits: 0,
          maxCubeMapTextureSize: 0,
          maxFragmentUniformVectors: 0,
          maxRenderbufferSize: 0,
          maxTextureImageUnits: 0,
          maxTextureMaxAnisotropy: 0,
          maxTextureSize: 0,
          maxVaryingVectors: 0,
          maxVertexAttributes: 0,
          maxVertexTextureImageUnits: 0,
          maxVertexUniformVectors: 0,
          redBits: 0,
          stencilBits: 0,
          subpixelBits: 0,
        },
        hash: "",
      };

      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (!gl) return result;

        result.available = true;

        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

        if (debugInfo) {
          result.vendor =
            gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
          result.renderer =
            gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
        }

        result.vendorUnmasked = result.vendor;
        result.rendererUnmasked = result.renderer;
        result.version = gl.getParameter(gl.VERSION) || "";
        result.shadingLanguageVersion =
          gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || "";

        const extensions = gl.getSupportedExtensions();
        result.extensions = extensions ? Array.from(extensions) : [];
        result.parameters = collectWebGLParameters(gl);

        const hashData =
          result.vendor +
          result.renderer +
          result.version +
          result.shadingLanguageVersion +
          result.extensions.join(",") +
          JSON.stringify(result.parameters);

        result.hash = hashString(hashData);
      } catch (error) {
        // Silent mode - no warnings
        // console.warn("WebGLCollector error:", error);
      }

      return result;
    }
  }

  function collectWebGLParameters(gl) {
    const getParam = (param) => gl.getParameter(param);
    const getFloatParam = (param) => {
      const value = gl.getParameter(param);
      return Array.isArray(value) ? value.join(",") : String(value);
    };

    return {
      aliasedLineWidthRange: getFloatParam(gl.ALIASED_LINE_WIDTH_RANGE),
      aliasedPointSizeRange: getFloatParam(gl.ALIASED_POINT_SIZE_RANGE),
      alphaBits: getParam(gl.ALPHA_BITS),
      blueBits: getParam(gl.BLUE_BITS),
      depthBits: getParam(gl.DEPTH_BITS),
      greenBits: getParam(gl.GREEN_BITS),
      maxCombinedTextureImageUnits: getParam(
        gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
      ),
      maxCubeMapTextureSize: getParam(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
      maxFragmentUniformVectors: getParam(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      maxRenderbufferSize: getParam(gl.MAX_RENDERBUFFER_SIZE),
      maxTextureImageUnits: getParam(gl.MAX_TEXTURE_IMAGE_UNITS),
      maxTextureMaxAnisotropy: getMaxAnisotropy(gl),
      maxTextureSize: getParam(gl.MAX_TEXTURE_SIZE),
      maxVaryingVectors: getParam(gl.MAX_VARYING_VECTORS),
      maxVertexAttributes: getParam(gl.MAX_VERTEX_ATTRIBS),
      maxVertexTextureImageUnits: getParam(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxVertexUniformVectors: getParam(gl.MAX_VERTEX_UNIFORM_VECTORS),
      redBits: getParam(gl.RED_BITS),
      stencilBits: getParam(gl.STENCIL_BITS),
      subpixelBits: getParam(gl.SUBPIXEL_BITS),
    };
  }

  function getMaxAnisotropy(gl) {
    const ext =
      gl.getExtension("EXT_texture_filter_anisotropic") ||
      gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
      gl.getExtension("MOZ_EXT_texture_filter_anisotropic");

    if (ext) {
      return gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    }
    return 0;
  }

  /**
   * Audio Collector
   */
  class AudioCollector {
    constructor() {
      this.name = "audio";
      this.enabled = true;
    }

    async collect() {
      const result = {
        available: false,
        hash: "",
        sampleRate: 0,
        channelCount: 0,
        state: "",
      };

      try {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return result;

        const audioContext = new AudioContext();
        result.available = true;
        result.sampleRate = audioContext.sampleRate;
        result.channelCount = audioContext.destination.channelCount;
        result.state = audioContext.state;

        const oscillator = audioContext.createOscillator();
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        const compressor = audioContext.createDynamicsCompressor();

        compressor.threshold.value = -50;
        compressor.knee.value = 40;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        oscillator.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(compressor);
        compressor.connect(audioContext.destination);

        oscillator.type = "triangle";
        oscillator.frequency.value = 1000;
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.5;

        oscillator.start(0);
        oscillator.stop(audioContext.currentTime + 0.1);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const audioData = Array.from(dataArray).join(",");
        result.hash = hashString(
          audioData + result.sampleRate + result.channelCount,
        );

        setTimeout(() => audioContext.close(), 100);
      } catch (error) {
        // Silent mode - no warnings
        // console.warn("AudioCollector error:", error);
      }

      return result;
    }
  }

  /**
   * Fonts Collector
   */
  class FontsCollector {
    constructor() {
      this.name = "fonts";
      this.enabled = true;
    }

    async collect() {
      const result = {
        available: false,
        detected: [],
        hash: "",
      };

      try {
        result.available = true;
        const detectedFonts = this.detectFonts();
        result.detected = detectedFonts;
        result.hash = hashString(detectedFonts.join(","));
      } catch (error) {
        // Silent mode - no warnings
        // console.warn("FontsCollector error:", error);
      }

      return result;
    }

    detectFonts() {
      const testFonts = [
        "Arial",
        "Arial Black",
        "Helvetica",
        "Times New Roman",
        "Times",
        "Courier New",
        "Courier",
        "Verdana",
        "Georgia",
        "Palatino",
        "Garamond",
        "Bookman",
        "Comic Sans MS",
        "Trebuchet MS",
        "Arial Narrow",
        "Impact",
        "Lucida Console",
        "Lucida Sans Unicode",
        "Tahoma",
        "Geneva",
        "Century Gothic",
        "Copperplate",
        "Papyrus",
        "Futura",
        "Optima",
        "Hoefler Text",
        "Didot",
        "American Typewriter",
        "Andale Mono",
        "Brush Script MT",
        "Lucida Bright",
        "Palatino Linotype",
        "Segoe UI",
        "Segoe UI Light",
        "Segoe UI Semibold",
        "Segoe UI Symbol",
        "Roboto",
        "Open Sans",
        "Lato",
        "Montserrat",
        "Oswald",
        "Source Sans Pro",
        "Microsoft YaHei",
        "SimSun",
        "SimHei",
        "Meiryo",
        "Yu Gothic",
        "Malgun Gothic",
        "Wingdings",
        "Webdings",
        "Symbol",
        "MS Gothic",
        "MS Mincho",
      ];

      const detected = [];
      const container = document.createElement("div");
      container.style.cssText =
        "position:absolute;left:-9999px;top:0;font-size:72px;line-height:normal;";
      document.body.appendChild(container);

      for (const font of testFonts) {
        if (this.isFontAvailable(font, container)) {
          detected.push(font);
        }
      }

      document.body.removeChild(container);
      return detected;
    }

    isFontAvailable(font, container) {
      const baseFont = "monospace";
      const testString = "mmmmmmmmmmlli";

      const span = document.createElement("span");
      span.style.fontFamily = `"${font}", ${baseFont}`;
      span.style.fontSize = "72px";
      span.textContent = testString;

      container.appendChild(span);
      const fontWidth = span.offsetWidth;
      container.removeChild(span);

      span.style.fontFamily = baseFont;
      container.appendChild(span);
      const baseWidth = span.offsetWidth;
      container.removeChild(span);

      return fontWidth !== baseWidth;
    }
  }

  /**
   * Hardware Collector
   */
  class HardwareCollector {
    constructor() {
      this.name = "hardware";
      this.enabled = true;
    }

    async collect() {
      const result = {
        cpuCores: navigator.hardwareConcurrency || 0,
        memory: navigator.deviceMemory || 0,
        touchPoints: navigator.maxTouchPoints || 0,
        pointerType: this.getPointerTypes(),
        mediaDevices: {
          audioInput: 0,
          audioOutput: 0,
          videoInput: 0,
        },
        battery: undefined,
      };

      try {
        if (navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          result.mediaDevices.audioInput = devices.filter(
            (d) => d.kind === "audioinput",
          ).length;
          result.mediaDevices.audioOutput = devices.filter(
            (d) => d.kind === "audiooutput",
          ).length;
          result.mediaDevices.videoInput = devices.filter(
            (d) => d.kind === "videoinput",
          ).length;
        }
      } catch (error) {
        // Silent mode - no warnings
        // console.warn("HardwareCollector mediaDevices error:", error);
      }

      try {
        if (navigator.getBattery) {
          const battery = await navigator.getBattery();
          result.battery = {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          };
        }
      } catch (error) {
        // Silent mode - no warnings
        // console.warn("HardwareCollector battery error:", error);
      }

      return result;
    }

    getPointerTypes() {
      const pointerTypes = [];

      if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        pointerTypes.push("touch");
      }

      if (navigator.maxTouchPoints === 0) {
        pointerTypes.push("coarse");
      }

      return pointerTypes;
    }
  }

  /**
   * Browser Collector
   */
  class BrowserCollector {
    constructor() {
      this.name = "browser";
      this.enabled = true;
    }

    collect() {
      const ua = navigator.userAgent;
      const uaData = navigator.userAgentData;

      const browserInfo = this.parseBrowser(ua, uaData);
      const deviceInfo = this.parseDevice(ua, uaData);
      const engineInfo = this.parseEngine(ua);

      return {
        name: browserInfo.name,
        version: browserInfo.version,
        majorVersion: browserInfo.majorVersion,
        engine: engineInfo.name,
        engineVersion: engineInfo.version,
        isBot: this.isBot(ua),
        isMobile: deviceInfo.isMobile,
        isTablet: deviceInfo.isTablet,
        isDesktop: deviceInfo.isDesktop,
        isSmartTV: deviceInfo.isSmartTV,
        isWearable: deviceInfo.isWearable,
        isConsole: deviceInfo.isConsole,
        isEmbedded: deviceInfo.isEmbedded,
      };
    }

    parseBrowser(ua, uaData) {
      if (uaData?.brands) {
        const mainBrand = uaData.brands[0];
        if (mainBrand) {
          return {
            name: mainBrand.brand || this.detectBrowserLegacy(ua),
            version: mainBrand.version || "",
            majorVersion: mainBrand.version.split(".")[0] || "",
          };
        }
      }

      return this.detectBrowserLegacy(ua);
    }

    detectBrowserLegacy(ua) {
      const browsers = [
        { name: "Opera", regex: /Opera\/(\d+\.\d+)/ },
        { name: "Opera", regex: /OPR\/(\d+\.\d+)/ },
        { name: "Edge", regex: /Edg\/(\d+\.\d+)/ },
        { name: "Edge", regex: /Edge\/(\d+\.\d+)/ },
        { name: "Samsung Internet", regex: /SamsungBrowser\/(\d+\.\d+)/ },
        { name: "UC Browser", regex: /UCBrowser\/(\d+\.\d+)/ },
        { name: "Firefox", regex: /Firefox\/(\d+\.\d+)/ },
        { name: "IE", regex: /MSIE (\d+\.\d+)/ },
        { name: "IE", regex: /Trident\/.*rv:(\d+\.\d+)/ },
        { name: "Chrome", regex: /Chrome\/(\d+\.\d+)/ },
        { name: "Safari", regex: /Version\/(\d+\.\d+).*Safari/ },
      ];

      for (const browser of browsers) {
        const match = ua.match(browser.regex);
        if (match) {
          const version = match[1];
          return {
            name: browser.name,
            version: version,
            majorVersion: version.split(".")[0],
          };
        }
      }

      return { name: "Unknown", version: "", majorVersion: "" };
    }

    parseEngine(ua) {
      const engines = [
        { name: "Blink", regex: /Chrome\/\d+/ },
        { name: "WebKit", regex: /AppleWebKit\/(\d+\.\d+)/ },
        { name: "Gecko", regex: /Gecko\/(\d+)/ },
        { name: "Trident", regex: /Trident\/(\d+\.\d+)/ },
      ];

      for (const engine of engines) {
        const match = ua.match(engine.regex);
        if (match) {
          return {
            name: engine.name,
            version: match[1] || "",
          };
        }
      }

      return { name: "Unknown", version: "" };
    }

    parseDevice(ua, uaData) {
      if (uaData?.mobile !== undefined) {
        return {
          isMobile: uaData.mobile,
          isTablet: /tablet/i.test(ua),
          isDesktop: !uaData.mobile,
          isSmartTV: this.isSmartTV(ua),
          isWearable: this.isWearable(ua),
          isConsole: this.isConsole(ua),
          isEmbedded: this.isEmbedded(ua),
        };
      }

      const isMobile =
        /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          ua,
        );
      const isTablet = /Tablet|iPad|PlayBook|Silk|SM-T\d+|GT-P\d+/i.test(ua);

      return {
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        isSmartTV: this.isSmartTV(ua),
        isWearable: this.isWearable(ua),
        isConsole: this.isConsole(ua),
        isEmbedded: this.isEmbedded(ua),
      };
    }

    isSmartTV(ua) {
      return /SmartTV|NetCast|AppleTV|Android TV|GoogleTV|Web0S|SonyTV|Viera|BRAVIA/i.test(
        ua,
      );
    }

    isWearable(ua) {
      return /Watch|Wear OS|watchOS|Tizen.*Watch|Gear/i.test(ua);
    }

    isConsole(ua) {
      return /Nintendo|PlayStation|Xbox/i.test(ua);
    }

    isEmbedded(ua) {
      return /Electron|NW.js|node-webkit|QtWebEngine|CEF|Chromium Embedded/i.test(
        ua,
      );
    }

    isBot(ua) {
      const botPatterns = [
        /bot|crawler|spider|scraper|curl|wget|http/i,
        /Googlebot|Bingbot|YandexBot|BaiduSpider|DuckDuckBot/i,
        /facebookexternalhit|WhatsApp|TelegramBot/i,
        /HeadlessChrome|Puppeteer|Selenium|Playwright/i,
      ];

      return botPatterns.some((pattern) => pattern.test(ua));
    }
  }

  /**
   * Timezone Collector
   */
  class TimezoneCollector {
    constructor() {
      this.name = "timezone";
      this.enabled = true;
    }

    collect() {
      const date = new Date();
      const timezoneName = this.getTimezoneName(date);
      const offset = -date.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offset) / 60);
      const offsetMinutes = Math.abs(offset) % 60;
      const offsetSign = offset >= 0 ? "+" : "-";
      const offsetString = `UTC${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;

      return {
        name: timezoneName,
        offset: offset,
        offsetString: offsetString,
        abbreviation: this.getTimezoneAbbreviation(date),
        dst: this.isDST(date),
      };
    }

    getTimezoneName(date) {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch {
        return "Unknown";
      }
    }

    getTimezoneAbbreviation(date) {
      try {
        const formatter = new Intl.DateTimeFormat("en", {
          timeZoneName: "short",
        });
        const parts = formatter.formatToParts(date);
        const timezonePart = parts.find((part) => part.type === "timeZoneName");
        return timezonePart?.value;
      } catch {
        return undefined;
      }
    }

    isDST(date) {
      const year = date.getFullYear();
      const january = new Date(year, 0, 1);
      const july = new Date(year, 6, 1);

      const janOffset = january.getTimezoneOffset();
      const julOffset = july.getTimezoneOffset();
      const currentOffset = date.getTimezoneOffset();

      const isNorthernHemisphere = janOffset > julOffset;
      const isDST = isNorthernHemisphere
        ? currentOffset < janOffset
        : currentOffset > janOffset;

      return isDST;
    }
  }

  /**
   * Language Collector
   */
  class LanguageCollector {
    constructor() {
      this.name = "language";
      this.enabled = true;
    }

    collect() {
      const languages =
        navigator.languages?.length > 0
          ? Array.from(navigator.languages)
          : [navigator.language || "en"];

      const primary = languages[0] || "en";

      return {
        primary: primary,
        all: languages,
        hash: hashString(languages.join(",")),
      };
    }
  }

  /**
   * Platform Collector
   */
  class PlatformCollector {
    constructor() {
      this.name = "platform";
      this.enabled = true;
    }

    collect() {
      const ua = navigator.userAgent;
      const platform = navigator.platform;
      const osInfo = this.detectOS(ua, platform);

      return {
        type: this.getPlatformType(osInfo.name),
        name: osInfo.name,
        version: osInfo.version,
        architecture: this.getArchitecture(ua, platform),
      };
    }

    getPlatformType(osName) {
      const mobileOS = [
        "Android",
        "iOS",
        "Windows Phone",
        "BlackBerry",
        "webOS",
      ];
      if (
        mobileOS.some((os) => osName.toLowerCase().includes(os.toLowerCase()))
      ) {
        return "mobile";
      }
      return "desktop";
    }

    detectOS(ua, platform) {
      const osPatterns = [
        { name: "Windows", regex: /Windows NT (\d+\.\d+)/ },
        { name: "macOS", regex: /Mac OS X (\d+[\._]\d+)/ },
        { name: "iOS", regex: /OS (\d+_\d+)/ },
        { name: "Android", regex: /Android (\d+\.\d+)/ },
        { name: "Linux", regex: /Linux/ },
        { name: "Chrome OS", regex: /CrOS/ },
      ];

      for (const os of osPatterns) {
        const match = ua.match(os.regex);
        if (match) {
          let version = match[1] || "";
          if (os.name === "iOS") version = version.replace(/_/g, ".");
          else if (os.name === "macOS") version = version.replace(/_/g, ".");
          return { name: os.name, version };
        }
      }

      if (platform) {
        return { name: platform, version: "" };
      }

      return { name: "Unknown", version: "" };
    }

    getArchitecture(ua, platform) {
      if (/WOW64|Win64|x86_64|x86_32/i.test(ua)) return "64-bit";
      if (/x86|i386|i686/i.test(ua) || platform?.startsWith("Win32"))
        return "32-bit";
      if (/arm|aarch64/i.test(ua)) return "ARM";
      return "Unknown";
    }
  }

  /**
   * Touch Collector
   */
  class TouchCollector {
    constructor() {
      this.name = "touch";
      this.enabled = true;
    }

    collect() {
      const available =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const points = navigator.maxTouchPoints || 0;
      const events = this.getSupportedTouchEvents();

      return {
        available,
        points,
        events,
      };
    }

    getSupportedTouchEvents() {
      const events = [];
      const testEvents = [
        "touchstart",
        "touchmove",
        "touchend",
        "touchcancel",
        "touchenter",
        "touchleave",
        "gesturestart",
        "gesturechange",
        "gestureend",
      ];

      for (const event of testEvents) {
        if (`on${event}` in window) {
          events.push(event);
        }
      }

      return events;
    }
  }

  /**
   * Connection Collector
   */
  class ConnectionCollector {
    constructor() {
      this.name = "connection";
      this.enabled = true;
    }

    collect() {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (!connection) {
        return { available: false };
      }

      return {
        available: true,
        type: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        downlinkMax: connection.downlinkMax,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
  }

  /**
   * Storage Collector
   */
  class StorageCollector {
    constructor() {
      this.name = "storage";
      this.enabled = true;
    }

    collect() {
      return {
        localStorage: this.testLocalStorage(),
        sessionStorage: this.testSessionStorage(),
        indexedDB: "indexedDB" in window,
        cookies: this.testCookies(),
        cacheStorage: "caches" in window,
        fileSystemAccess: "showOpenFilePicker" in window,
      };
    }

    testLocalStorage() {
      try {
        const test = "__iffingerprint_test__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    }

    testSessionStorage() {
      try {
        const test = "__iffingerprint_test__";
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    }

    testCookies() {
      try {
        const test = "__iffingerprint_test__";
        document.cookie = `${test}=1;max-age=1`;
        return document.cookie.includes(test);
      } catch {
        return false;
      }
    }
  }

  // ============================================
  // MAIN ENGINE
  // ============================================

  const IFFINGERPRINT_VERSION = "1.0.0";

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
    },
    cacheEnabled: true,
    cacheDuration: 300000,
    behavioralEnabled: false,
    debug: false,
  };

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
  };

  class IFFingerprint {
    constructor(config) {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.cache = null;
      this.cacheTimestamp = 0;
      this.initializeCollectors();

      if (this.config.debug) {
        console.log("[IFFingerprint] Initialized with config:", this.config);
      }
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
          // Silent mode - no warnings
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

      const importantComponents = ["canvas", "webgl", "audio", "fonts"];
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

  global.IFFingerprint = IFFingerprint;
  global.IFFINGERPRINT_VERSION = IFFINGERPRINT_VERSION;
})(
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
      ? global
      : this,
);
