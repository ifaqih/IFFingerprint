/**
 * Browser Collector
 * Mendeteksi browser, engine, dan tipe device
 */
export class BrowserCollector {
    constructor() {
        this.name = 'browser';
        this.enabled = true;
    }
    collect() {
        const ua = navigator.userAgent;
        const uaData = navigator.userAgentData;
        const browserInfo = this.parseBrowser(ua, uaData);
        const deviceInfo = this.parseDevice(ua, uaData);
        const engineInfo = this.parseEngine(ua);
        return {
            name: browserInfo.name,
            version: browserInfo.version,
            majorVersion: browserInfo.majorVersion,
            engine: engineInfo.name,
            engineVersion: engineInfo.version,
            isBot: this.isBot(ua),
            isMobile: deviceInfo.isMobile,
            isTablet: deviceInfo.isTablet,
            isDesktop: deviceInfo.isDesktop,
            isSmartTV: deviceInfo.isSmartTV,
            isWearable: deviceInfo.isWearable,
            isConsole: deviceInfo.isConsole,
            isEmbedded: deviceInfo.isEmbedded,
        };
    }
    parseBrowser(ua, uaData) {
        // Gunakan Client Hints jika tersedia
        if (uaData?.brands) {
            const mainBrand = uaData.brands[0];
            if (mainBrand) {
                return {
                    name: mainBrand.brand || this.detectBrowserLegacy(ua),
                    version: mainBrand.version || '',
                    majorVersion: mainBrand.version.split('.')[0] || '',
                };
            }
        }
        return this.detectBrowserLegacy(ua);
    }
    detectBrowserLegacy(ua) {
        const browsers = [
            { name: 'Opera', regex: /Opera\/(\d+\.\d+)/ },
            { name: 'Opera', regex: /OPR\/(\d+\.\d+)/ },
            { name: 'Edge', regex: /Edg\/(\d+\.\d+)/ },
            { name: 'Edge', regex: /Edge\/(\d+\.\d+)/ },
            { name: 'Samsung Internet', regex: /SamsungBrowser\/(\d+\.\d+)/ },
            { name: 'UC Browser', regex: /UCBrowser\/(\d+\.\d+)/ },
            { name: 'Firefox', regex: /Firefox\/(\d+\.\d+)/ },
            { name: 'IE', regex: /MSIE (\d+\.\d+)/ },
            { name: 'IE', regex: /Trident\/.*rv:(\d+\.\d+)/ },
            { name: 'Chrome', regex: /Chrome\/(\d+\.\d+)/ },
            { name: 'Safari', regex: /Version\/(\d+\.\d+).*Safari/ },
            { name: 'Brave', regex: /Brave Chrome\/(\d+\.\d+)/ },
        ];
        for (const browser of browsers) {
            const match = ua.match(browser.regex);
            if (match) {
                const version = match[1];
                return {
                    name: browser.name,
                    version: version,
                    majorVersion: version.split('.')[0],
                };
            }
        }
        return { name: 'Unknown', version: '', majorVersion: '' };
    }
    parseEngine(ua) {
        const engines = [
            { name: 'Blink', regex: /Chrome\/\d+/ },
            { name: 'WebKit', regex: /AppleWebKit\/(\d+\.\d+)/ },
            { name: 'Gecko', regex: /Gecko\/(\d+)/ },
            { name: 'Trident', regex: /Trident\/(\d+\.\d+)/ },
            { name: 'EdgeHTML', regex: /Edge\/(\d+\.\d+)/ },
        ];
        for (const engine of engines) {
            const match = ua.match(engine.regex);
            if (match) {
                return {
                    name: engine.name,
                    version: match[1] || '',
                };
            }
        }
        return { name: 'Unknown', version: '' };
    }
    parseDevice(ua, uaData) {
        // Gunakan Client Hints jika tersedia
        if (uaData?.mobile) {
            return {
                isMobile: uaData.mobile,
                isTablet: /tablet/i.test(ua),
                isDesktop: !uaData.mobile,
                isSmartTV: this.isSmartTV(ua),
                isWearable: this.isWearable(ua),
                isConsole: this.isConsole(ua),
                isEmbedded: this.isEmbedded(ua),
            };
        }
        const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        const isTablet = /Tablet|iPad|PlayBook|Silk|SM-T\d+|GT-P\d+/i.test(ua);
        return {
            isMobile,
            isTablet,
            isDesktop: !isMobile && !isTablet,
            isSmartTV: this.isSmartTV(ua),
            isWearable: this.isWearable(ua),
            isConsole: this.isConsole(ua),
            isEmbedded: this.isEmbedded(ua),
        };
    }
    isSmartTV(ua) {
        return /SmartTV|NetCast|AppleTV|Android TV|GoogleTV|Web0S|SonyTV|Viera|BRAVIA/i.test(ua);
    }
    isWearable(ua) {
        return /Watch|Wear OS|watchOS|Tizen.*Watch|Gear/i.test(ua);
    }
    isConsole(ua) {
        return /Nintendo|PlayStation|Xbox/i.test(ua);
    }
    isEmbedded(ua) {
        return /Electron|NW.js|node-webkit|QtWebEngine|CEF|Chromium Embedded/i.test(ua);
    }
    isBot(ua) {
        const botPatterns = [
            /bot|crawler|spider|scraper|curl|wget|http/i,
            /Googlebot|Bingbot|YandexBot|BaiduSpider|DuckDuckBot/i,
            /facebookexternalhit|WhatsApp|TelegramBot/i,
            /HeadlessChrome|Puppeteer|Selenium|Playwright/i,
        ];
        return botPatterns.some(pattern => pattern.test(ua));
    }
}
//# sourceMappingURL=BrowserCollector.js.map