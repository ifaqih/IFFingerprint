/**
 * Storage Collector
 * Mengumpulkan data storage capabilities
 */
export class StorageCollector {
    constructor() {
        this.name = 'storage';
        this.enabled = true;
    }
    collect() {
        return {
            localStorage: this.testLocalStorage(),
            sessionStorage: this.testSessionStorage(),
            indexedDB: this.testIndexedDB(),
            cookies: this.testCookies(),
            cacheStorage: this.testCacheStorage(),
            fileSystemAccess: this.testFileSystemAccess(),
        };
    }
    testLocalStorage() {
        try {
            const test = '__iffingerprint_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        }
        catch {
            return false;
        }
    }
    testSessionStorage() {
        try {
            const test = '__iffingerprint_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        }
        catch {
            return false;
        }
    }
    testIndexedDB() {
        return 'indexedDB' in window;
    }
    testCookies() {
        try {
            const test = '__iffingerprint_test__';
            document.cookie = `${test}=1;max-age=1`;
            return document.cookie.includes(test);
        }
        catch {
            return false;
        }
    }
    testCacheStorage() {
        return 'caches' in window;
    }
    testFileSystemAccess() {
        return 'showOpenFilePicker' in window;
    }
}
//# sourceMappingURL=StorageCollector.js.map