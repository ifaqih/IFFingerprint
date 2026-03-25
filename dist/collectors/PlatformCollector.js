/**
 * Platform Collector
 * Mengumpulkan data platform/OS
 */
export class PlatformCollector {
    constructor() {
        this.name = 'platform';
        this.enabled = true;
    }
    collect() {
        const ua = navigator.userAgent;
        const uaData = navigator.userAgentData;
        const platform = navigator.platform;
        // Gunakan Client Hints jika tersedia
        if (uaData?.platform) {
            return {
                type: this.getPlatformType(uaData.platform),
                name: uaData.platform,
                version: this.getOSVersion(ua, uaData.platform),
                architecture: this.getArchitecture(ua, platform),
            };
        }
        const osInfo = this.detectOS(ua, platform);
        return {
            type: this.getPlatformType(osInfo.name),
            name: osInfo.name,
            version: osInfo.version,
            architecture: this.getArchitecture(ua, platform),
        };
    }
    getPlatformType(osName) {
        const mobileOS = ['Android', 'iOS', 'Windows Phone', 'BlackBerry', 'webOS'];
        const tabletOS = ['iPadOS', 'Android Tablet'];
        if (mobileOS.some(os => osName.toLowerCase().includes(os.toLowerCase()))) {
            return 'mobile';
        }
        if (tabletOS.some(os => osName.toLowerCase().includes(os.toLowerCase()))) {
            return 'tablet';
        }
        return 'desktop';
    }
    detectOS(ua, platform) {
        const osPatterns = [
            { name: 'Windows', regex: /Windows NT (\d+\.\d+)/ },
            { name: 'macOS', regex: /Mac OS X (\d+[\._]\d+)/ },
            { name: 'iOS', regex: /OS (\d+_\d+)/ },
            { name: 'Android', regex: /Android (\d+\.\d+)/ },
            { name: 'Linux', regex: /Linux/ },
            { name: 'Chrome OS', regex: /CrOS/ },
            { name: 'FreeBSD', regex: /FreeBSD/ },
            { name: 'OpenBSD', regex: /OpenBSD/ },
            { name: 'Solaris', regex: /SunOS/ },
            { name: 'BlackBerry', regex: /BlackBerry/ },
            { name: 'webOS', regex: /webOS/ },
            { name: 'Opera Mini', regex: /Opera Mini/ },
            { name: 'Nintendo', regex: /Nintendo/ },
            { name: 'PlayStation', regex: /PlayStation/ },
            { name: 'Xbox', regex: /Xbox/ },
        ];
        for (const os of osPatterns) {
            const match = ua.match(os.regex);
            if (match) {
                let version = match[1] || '';
                // Normalisasi versi
                if (os.name === 'iOS') {
                    version = version.replace(/_/g, '.');
                }
                else if (os.name === 'macOS') {
                    version = version.replace(/_/g, '.');
                }
                return { name: os.name, version };
            }
        }
        // Fallback ke platform
        if (platform) {
            return { name: platform, version: '' };
        }
        return { name: 'Unknown', version: '' };
    }
    getOSVersion(ua, osName) {
        const patterns = {
            'Windows': /Windows NT (\d+\.\d+)/,
            'macOS': /Mac OS X (\d+[\._]\d+)/,
            'iOS': /OS (\d+_\d+)/,
            'Android': /Android (\d+\.\d+)/,
        };
        const pattern = patterns[osName];
        if (pattern) {
            const match = ua.match(pattern);
            if (match) {
                let version = match[1];
                if (osName === 'iOS' || osName === 'macOS') {
                    version = version.replace(/_/g, '.');
                }
                return version;
            }
        }
        return '';
    }
    getArchitecture(ua, platform) {
        if (/WOW64|Win64|x86_64|x86_32/i.test(ua)) {
            return '64-bit';
        }
        if (/x86|i386|i686/i.test(ua) || platform.startsWith('Win32')) {
            return '32-bit';
        }
        if (/arm|aarch64/i.test(ua)) {
            return 'ARM';
        }
        return 'Unknown';
    }
}
//# sourceMappingURL=PlatformCollector.js.map