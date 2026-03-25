/**
 * CSS Collector
 * Mendeteksi fitur CSS yang didukung untuk fingerprinting
 * Teknik: Mengukur rendering elemen dengan berbagai properti CSS
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

export class CSSCollector {
  name = "css";
  enabled = true;

  async collect(): Promise<CSSData> {
    const result: CSSData = {
      supportedFeatures: [],
      fontSmoothing: "",
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

      // Generate hash
      const hashData = JSON.stringify({
        features: result.supportedFeatures,
        fontSmoothing: result.fontSmoothing,
        scrollbarWidth: result.scrollbarWidth,
        touchAction: result.touchAction,
        backdropFilter: result.backdropFilter,
        clipPath: result.clipPath,
        cssVariables: result.cssVariables,
        grid: result.grid,
        subgrid: result.subgrid,
        containerQueries: result.containerQueries,
      });

      result.hash = this.hashString(hashData);
    } catch (error) {
      console.warn("CSSCollector error:", error);
    }

    return result;
  }

  private testCSSFeatures(): string[] {
    const features: string[] = [];
    const tests: Array<{ name: string; prop: string; value?: string }> = [
      { name: "flexbox", prop: "display", value: "flex" },
      { name: "flexbox-gap", prop: "gap", value: "10px" },
      { name: "grid", prop: "display", value: "grid" },
      { name: "subgrid", prop: "display", value: "subgrid" },
      {
        name: "container-queries",
        prop: "container-type",
        value: "inline-size",
      },
      { name: "has-selector", prop: "selector", value: ":has(> div)" },
      { name: "nesting", prop: "nesting", value: "& > div" },
      { name: "oklch", prop: "color", value: "oklch(50% 0.2 270)" },
      { name: "lab", prop: "color", value: "lab(50% 0 0)" },
      {
        name: "color-mix",
        prop: "color",
        value: "color-mix(in srgb, red, blue)",
      },
      { name: "aspect-ratio", prop: "aspectRatio", value: "16/9" },
      { name: "line-clamp", prop: "lineClamp", value: "3" },
      { name: "text-wrap", prop: "textWrap", value: "balance" },
      { name: "scroll-timeline", prop: "scrollTimeline", value: "auto" },
      { name: "view-timeline", prop: "viewTimeline", value: "auto" },
      { name: "anchor-positioning", prop: "positionAnchor", value: "--anchor" },
      { name: "popovertarget", prop: "popover", value: "auto" },
      { name: "field-sizing", prop: "fieldSizing", value: "content" },
      { name: "text-box-trim", prop: "textBoxTrim", value: "both" },
      { name: "print-color-adjust", prop: "printColorAdjust", value: "exact" },
    ];

    for (const test of tests) {
      if (this.testProperty(test.name, test.prop, test.value)) {
        features.push(test.name);
      }
    }

    return features;
  }

  private testProperty(_name: string, prop: string, value?: string): boolean {
    try {
      const el = document.createElement("div");
      const style = el.style;

      if (!value) {
        return prop in style;
      }

      // Test dengan vendor prefixes
      const prefixes = ["", "-webkit-", "-moz-", "-ms-", "-o-"];

      for (const prefix of prefixes) {
        const prefixedProp = prefix + prop;
        const camelCaseProp = prefixedProp.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase(),
        );

        try {
          (style as any)[camelCaseProp] = value;
          if (
            (style as any)[camelCaseProp] === value ||
            style.cssText.includes(value)
          ) {
            return true;
          }
        } catch {
          continue;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  private getFontSmoothing(): string {
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;left:-9999px;font-size:14px;";
    el.textContent = "mm";
    document.body.appendChild(el);

    const computed = window.getComputedStyle(el);
    const smoothing =
      (computed as any).fontSmooth ||
      (computed as any)["font-smooth"] ||
      "auto";

    document.body.removeChild(el);
    return smoothing;
  }

  private getScrollbarWidth(): number {
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

  private testCSSVariables(): boolean {
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

  private testSubgrid(): boolean {
    try {
      const el = document.createElement("div");
      el.style.display = "grid";
      el.style.gridTemplateRows = "subgrid";

      const isSubgrid =
        el.style.gridTemplateRows === "subgrid" ||
        el.style.cssText.includes("subgrid");

      return isSubgrid;
    } catch {
      return false;
    }
  }

  private testContainerQueries(): boolean {
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

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
}
