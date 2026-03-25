/**
 * Battery Collector
 * Mengumpulkan data baterai device menggunakan Battery Status API
 *
 * Note: API ini tidak tersedia di semua browser (Firefox deprecated, Safari tidak support)
 * Hanya tersedia di Chrome/Edge dan beberapa browser Android
 */
import { BatteryData } from '../types';
export declare class BatteryCollector {
    name: string;
    enabled: boolean;
    collect(): Promise<BatteryData>;
}
//# sourceMappingURL=BatteryCollector.d.ts.map