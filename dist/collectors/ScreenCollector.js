/**
 * Screen Collector
 * Mengumpulkan data dari Screen API
 */
export class ScreenCollector {
    constructor() {
        this.name = "screen";
        this.enabled = true;
    }
    collect() {
        const screen = window.screen;
        return {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio,
            availLeft: screen.availLeft || 0,
            availTop: screen.availTop || 0,
            orientation: screen.orientation
                ? {
                    type: screen.orientation.type,
                    angle: screen.orientation.angle,
                }
                : undefined,
            isExtended: screen.isExtended || false,
            // ✅ FIXED: Use screen values instead of visualViewport for stability
            // visualViewport changes on window resize, causing fingerprint instability
            screenHeight: screen.height,
            screenWidth: screen.width,
            y: 0,
            x: 0,
        };
    }
}
//# sourceMappingURL=ScreenCollector.js.map