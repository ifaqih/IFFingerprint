/**
 * WebGL Collector
 * Mengumpulkan data dari WebGL API untuk fingerprinting GPU dan driver
 */

import { WebGLData, WebGLParameters } from "../types";
import { hashString } from "../utils";

export class WebGLCollector {
  name = "webgl";
  enabled = true;

  // ✅ OPTIMIZATION: Cache extensions (no accuracy loss)
  private cachedExtensions: Record<string, any> = {};

  async collect(): Promise<WebGLData> {
    const result: WebGLData = {
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
        canvas.getContext("webgl", {
          // ✅ OPTIMIZED: Disable antialiasing untuk performa (tidak mempengaruhi fingerprint)
          antialias: false,
          // ✅ OPTIMIZED: Alpha tidak diperlukan
          alpha: false,
        }) || canvas.getContext("experimental-webgl");

      if (!gl) {
        return result;
      }

      result.available = true;
      const glContext = gl as WebGLRenderingContext;

      // ✅ BATCH: Get all extensions once
      const allExtensions = glContext.getSupportedExtensions();
      result.extensions = allExtensions ? Array.from(allExtensions) : [];

      // ✅ CACHE: Get extensions once
      const debugInfo = this.getExtension(
        glContext,
        "WEBGL_debug_renderer_info",
      );
      const anisotropy = this.getExtension(
        glContext,
        "EXT_texture_filter_anisotropic",
      );

      if (debugInfo) {
        result.vendor =
          glContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
        result.renderer =
          glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
      }

      // Get unmasked info
      result.vendorUnmasked = result.vendor;
      result.rendererUnmasked = result.renderer;

      // Get version info
      result.version = glContext.getParameter(glContext.VERSION) || "";
      result.shadingLanguageVersion =
        glContext.getParameter(glContext.SHADING_LANGUAGE_VERSION) || "";

      // Get parameters
      result.parameters = this.collectParameters(glContext, anisotropy);

      // Generate hash
      const hashData =
        result.vendor +
        result.renderer +
        result.version +
        result.shadingLanguageVersion +
        result.extensions.join(",") +
        JSON.stringify(result.parameters);

      result.hash = hashString(hashData);
    } catch (error) {
      console.warn("WebGLCollector error:", error);
    }

    return result;
  }

  private getExtension(gl: WebGLRenderingContext, name: string): any {
    // ✅ CHECK CACHE FIRST
    if (this.cachedExtensions[name]) {
      return this.cachedExtensions[name];
    }

    const ext = gl.getExtension(name);
    if (ext) {
      this.cachedExtensions[name] = ext;
    }
    return ext;
  }

  private collectParameters(
    gl: WebGLRenderingContext,
    anisotropy: any,
  ): WebGLParameters {
    // ✅ OPTIMIZED: Cache getParameter calls
    const paramCache = new Map<number, any>();
    const getParam = (pname: number) => {
      if (!paramCache.has(pname)) {
        paramCache.set(pname, gl.getParameter(pname));
      }
      return paramCache.get(pname);
    };

    const getFloatParam = (pname: number) => {
      const value = getParam(pname);
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
      maxTextureMaxAnisotropy: anisotropy
        ? getParam(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
        : 0,
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
}
