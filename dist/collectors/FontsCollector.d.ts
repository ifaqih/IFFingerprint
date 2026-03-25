/**
 * Fonts Collector
 * Mendeteksi font yang terinstall di sistem pengguna
 * Teknik: Mengukur perbedaan width text dengan berbagai font
 */
import { FontsData } from "../types";
export declare class FontsCollector {
    name: string;
    enabled: boolean;
    private readonly testFonts;
    private readonly baseFont;
    private readonly testString;
    private readonly testSize;
    private container;
    collect(): Promise<FontsData>;
    private detectFontsOptimized;
    private isFontAvailableOptimized;
}
//# sourceMappingURL=FontsCollector.d.ts.map