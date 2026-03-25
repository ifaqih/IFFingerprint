/**
 * Battery Collector
 * Mengumpulkan data baterai device menggunakan Battery Status API
 *
 * Note: API ini tidak tersedia di semua browser (Firefox deprecated, Safari tidak support)
 * Hanya tersedia di Chrome/Edge dan beberapa browser Android
 */
export class BatteryCollector {
    constructor() {
        this.name = 'battery';
        this.enabled = true;
    }
    async collect() {
        const result = {
            available: false,
            level: 0,
            charging: false,
            chargingTime: Infinity,
            dischargingTime: Infinity,
        };
        // Check if Battery Status API is available
        if (!navigator.getBattery) {
            return result;
        }
        try {
            const battery = await navigator.getBattery();
            result.available = true;
            result.level = battery.level;
            result.charging = battery.charging;
            result.chargingTime = battery.chargingTime;
            result.dischargingTime = battery.dischargingTime;
            // Add metadata untuk fingerprinting
            // Level biasanya dalam increment 0.01, 0.05, atau 0.20
            // Ini bisa menjadi fingerprint yang unik
            result.levelRounded = Math.round(battery.level * 20) / 20;
            result.chargingTimeMinutes = battery.chargingTime === Infinity
                ? -1
                : Math.round(battery.chargingTime / 60);
            result.dischargingTimeMinutes = battery.dischargingTime === Infinity
                ? -1
                : Math.round(battery.dischargingTime / 60);
        }
        catch (error) {
            console.warn('BatteryCollector error:', error);
        }
        return result;
    }
}
//# sourceMappingURL=BatteryCollector.js.map