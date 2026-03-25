/**
 * Browser Collector
 * Mendeteksi browser, engine, dan tipe device
 */
import { BrowserData } from '../types';
export declare class BrowserCollector {
    name: string;
    enabled: boolean;
    collect(): BrowserData;
    private parseBrowser;
    private detectBrowserLegacy;
    private parseEngine;
    private parseDevice;
    private isSmartTV;
    private isWearable;
    private isConsole;
    private isEmbedded;
    private isBot;
}
//# sourceMappingURL=BrowserCollector.d.ts.map