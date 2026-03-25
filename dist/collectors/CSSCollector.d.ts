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
export declare class CSSCollector {
    name: string;
    enabled: boolean;
    collect(): Promise<CSSData>;
    private testCSSFeatures;
    private testProperty;
    private getFontSmoothing;
    private getScrollbarWidth;
    private testCSSVariables;
    private testSubgrid;
    private testContainerQueries;
    private hashString;
}
//# sourceMappingURL=CSSCollector.d.ts.map