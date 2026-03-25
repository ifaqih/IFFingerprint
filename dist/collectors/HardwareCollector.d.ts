/**
 * Hardware Collector
 * Mengumpulkan data hardware device
 */
import { HardwareData } from "../types";
export declare class HardwareCollector {
    name: string;
    enabled: boolean;
    collect(): Promise<HardwareData>;
    private getPointerTypes;
}
//# sourceMappingURL=HardwareCollector.d.ts.map