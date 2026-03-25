/**
 * Timezone Collector
 * Mengumpulkan data timezone dari sistem
 */
import { TimezoneData } from "../types";
export declare class TimezoneCollector {
    name: string;
    enabled: boolean;
    collect(): TimezoneData;
    private getTimezoneName;
    private getTimezoneAbbreviation;
    private isDST;
}
//# sourceMappingURL=TimezoneCollector.d.ts.map