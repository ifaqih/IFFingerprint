/**
 * Navigator Collector
 * Mengumpulkan data dari Navigator API
 */

import { NavigatorData } from '../types';

export class NavigatorCollector {
  name = 'navigator';
  enabled = true;

  collect(): NavigatorData {
    const nav = navigator as any;
    
    return {
      userAgent: nav.userAgent || '',
      language: nav.language || '',
      languages: Array.from(nav.languages || []) as string[],
      platform: nav.platform || '',
      vendor: nav.vendor || '',
      cookieEnabled: nav.cookieEnabled,
      doNotTrack: nav.doNotTrack || null,
      hardwareConcurrency: nav.hardwareConcurrency || 0,
      deviceMemory: (nav as any).deviceMemory || 0,
      maxTouchPoints: nav.maxTouchPoints || 0,
      pdfViewerEnabled: nav.pdfViewerEnabled || false,
      vendorSub: nav.vendorSub || '',
      productSub: nav.productSub || '',
      appVersion: nav.appVersion || '',
      appCodeName: nav.appCodeName || '',
      appName: nav.appName || '',
      product: nav.product || '',
      oscpu: nav.oscpu || null,
      buildID: nav.buildID || null,
    };
  }
}
