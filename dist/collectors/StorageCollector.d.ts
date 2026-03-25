/**
 * Storage Collector
 * Mengumpulkan data storage capabilities
 */
import { StorageData } from '../types';
export declare class StorageCollector {
    name: string;
    enabled: boolean;
    collect(): StorageData;
    private testLocalStorage;
    private testSessionStorage;
    private testIndexedDB;
    private testCookies;
    private testCacheStorage;
    private testFileSystemAccess;
}
//# sourceMappingURL=StorageCollector.d.ts.map