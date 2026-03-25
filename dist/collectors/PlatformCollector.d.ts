/**
 * Platform Collector
 * Mengumpulkan data platform/OS
 */
import { PlatformData } from '../types';
export declare class PlatformCollector {
    name: string;
    enabled: boolean;
    collect(): PlatformData;
    private getPlatformType;
    private detectOS;
    private getOSVersion;
    private getArchitecture;
}
//# sourceMappingURL=PlatformCollector.d.ts.map