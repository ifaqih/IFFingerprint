/**
 * Connection Collector
 * Mengumpulkan data network connection
 */
export class ConnectionCollector {
    constructor() {
        this.name = 'connection';
        this.enabled = true;
    }
    collect() {
        const connection = navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;
        if (!connection) {
            return {
                available: false,
            };
        }
        return {
            available: true,
            type: connection.type,
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            downlinkMax: connection.downlinkMax,
            rtt: connection.rtt,
            saveData: connection.saveData,
        };
    }
}
//# sourceMappingURL=ConnectionCollector.js.map