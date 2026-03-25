/**
 * Storage Collector
 * Mengumpulkan data storage capabilities
 */

import { StorageData } from '../types';

export class StorageCollector {
  name = 'storage';
  enabled = true;

  collect(): StorageData {
    return {
      localStorage: this.testLocalStorage(),
      sessionStorage: this.testSessionStorage(),
      indexedDB: this.testIndexedDB(),
      cookies: this.testCookies(),
      cacheStorage: this.testCacheStorage(),
      fileSystemAccess: this.testFileSystemAccess(),
    };
  }

  private testLocalStorage(): boolean {
    try {
      const test = '__iffingerprint_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private testSessionStorage(): boolean {
    try {
      const test = '__iffingerprint_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private testIndexedDB(): boolean {
    return 'indexedDB' in window;
  }

  private testCookies(): boolean {
    try {
      const test = '__iffingerprint_test__';
      document.cookie = `${test}=1;max-age=1`;
      return document.cookie.includes(test);
    } catch {
      return false;
    }
  }

  private testCacheStorage(): boolean {
    return 'caches' in window;
  }

  private testFileSystemAccess(): boolean {
    return 'showOpenFilePicker' in window;
  }
}
