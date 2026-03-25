/**
 * Permissions Collector
 * Mengumpulkan data permissions yang didukung
 */
import { PermissionsData } from '../types';
export declare class PermissionsCollector {
    name: string;
    enabled: boolean;
    private readonly testPermissions;
    collect(): Promise<PermissionsData>;
}
//# sourceMappingURL=PermissionsCollector.d.ts.map