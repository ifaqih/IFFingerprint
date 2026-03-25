/**
 * Navigator Collector
 * Mengumpulkan data dari Navigator API
 */
export class NavigatorCollector {
    constructor() {
        this.name = 'navigator';
        this.enabled = true;
    }
    collect() {
        const nav = navigator;
        return {
            userAgent: nav.userAgent || '',
            language: nav.language || '',
            languages: Array.from(nav.languages || []),
            platform: nav.platform || '',
            vendor: nav.vendor || '',
            cookieEnabled: nav.cookieEnabled,
            doNotTrack: nav.doNotTrack || null,
            hardwareConcurrency: nav.hardwareConcurrency || 0,
            deviceMemory: nav.deviceMemory || 0,
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
//# sourceMappingURL=NavigatorCollector.js.map