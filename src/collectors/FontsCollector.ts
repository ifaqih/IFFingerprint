/**
 * Fonts Collector
 * Mendeteksi font yang terinstall di sistem pengguna
 * Teknik: Mengukur perbedaan width text dengan berbagai font
 */

import { FontsData } from "../types";
import { hashString } from "../utils";

export class FontsCollector {
  name = "fonts";
  enabled = true;

  // ✅ FULL LIST: 100+ fonts untuk MAXIMUM accuracy
  private readonly testFonts = [
    // Serif
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
    // Google Fonts populer
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Oswald",
    "Source Sans Pro",
    "Slabo 27px",
    "Raleway",
    "PT Sans",
    "Merriweather",
    "Noto Sans",
    "Ubuntu",
    "Playfair Display",
    "Droid Sans",
    "Lora",
    "Titillium Web",
    "Arimo",
    "Droid Serif",
    "PT Serif",
    "Fira Sans",
    // Fonts Asia
    "Noto Sans CJK JP",
    "Noto Sans CJK KR",
    "Noto Sans CJK SC",
    "Noto Sans CJK TC",
    "Microsoft YaHei",
    "SimSun",
    "SimHei",
    "Meiryo",
    "Yu Gothic",
    "Malgun Gothic",
    // Fonts Arab
    "Arial",
    "Traditional Arabic",
    "Simplified Arabic",
    "Tahoma",
    // Fonts India
    "Mangal",
    "Latha",
    "Gautami",
    "Kartika",
    // Fonts lainnya
    "Wingdings",
    "Webdings",
    "Symbol",
    "MS Gothic",
    "MS Mincho",
    "PMingLiU",
  ];

  private readonly baseFont = "monospace";
  private readonly testString = "mmmmmmmmmmlli";
  private readonly testSize = "72px";

  // ✅ OPTIMIZATION: Reuse container untuk semua font tests (no accuracy loss)
  private container: HTMLDivElement | null = null;

  async collect(): Promise<FontsData> {
    const result: FontsData = {
      available: false,
      detected: [],
      hash: "",
    };

    try {
      result.available = true;

      // ✅ OPTIMIZED: Batch detection dengan single container
      const detectedFonts = this.detectFontsOptimized();
      result.detected = detectedFonts;
      result.hash = hashString(detectedFonts.join(","));
    } catch (error) {
      console.warn("FontsCollector error:", error);
    }

    return result;
  }

  private detectFontsOptimized(): string[] {
    const detected: string[] = [];

    // ✅ CREATE ONCE: Single container untuk semua tests
    this.container = document.createElement("div");
    this.container.style.cssText =
      "position:absolute;left:-9999px;top:0;font-size:72px;line-height:normal;visibility:hidden;";
    document.body.appendChild(this.container);

    // ✅ BATCH: Test semua fonts dengan container yang sama
    for (const font of this.testFonts) {
      if (this.isFontAvailableOptimized(font)) {
        detected.push(font);
      }
    }

    // ✅ CLEANUP: Remove container sekali saja
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }

    return detected;
  }

  private isFontAvailableOptimized(font: string): boolean {
    if (!this.container) return false;

    const span = document.createElement("span");
    span.style.fontFamily = `"${font}", ${this.baseFont}`;
    span.style.fontSize = this.testSize;
    span.style.margin = "0";
    span.style.padding = "0";
    span.style.border = "none";
    span.style.whiteSpace = "normal";
    span.textContent = this.testString;

    this.container.appendChild(span);
    const fontWidth = span.offsetWidth;
    this.container.removeChild(span);

    span.style.fontFamily = this.baseFont;
    this.container.appendChild(span);
    const baseWidth = span.offsetWidth;
    this.container.removeChild(span);

    return fontWidth !== baseWidth;
  }
}
