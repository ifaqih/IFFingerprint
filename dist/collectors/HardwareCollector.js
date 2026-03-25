/**
 * Hardware Collector
 * Mengumpulkan data hardware device
 */
export class HardwareCollector {
    constructor() {
        this.name = "hardware";
        this.enabled = true;
    }
    async collect() {
        const result = {
            cpuCores: navigator.hardwareConcurrency || 0,
            memory: navigator.deviceMemory || 0,
            touchPoints: navigator.maxTouchPoints || 0,
            pointerType: this.getPointerTypes(),
            mediaDevices: {
                audioInput: 0,
                audioOutput: 0,
                videoInput: 0,
            },
            battery: undefined,
        };
        // Get media devices
        try {
            const devices = await navigator.mediaDevices?.enumerateDevices();
            if (devices) {
                result.mediaDevices.audioInput = devices.filter((d) => d.kind === "audioinput").length;
                result.mediaDevices.audioOutput = devices.filter((d) => d.kind === "audiooutput").length;
                result.mediaDevices.videoInput = devices.filter((d) => d.kind === "videoinput").length;
            }
        }
        catch (error) {
            console.warn("HardwareCollector mediaDevices error:", error);
        }
        // Get battery info
        try {
            const battery = await navigator.getBattery?.();
            if (battery) {
                result.battery = {
                    level: battery.level,
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime,
                };
            }
        }
        catch (error) {
            console.warn("HardwareCollector battery error:", error);
        }
        return result;
    }
    getPointerTypes() {
        const pointerTypes = [];
        // Check touch support
        if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
            pointerTypes.push("touch");
        }
        // Check pen support
        if (window.PointerEvent) {
            // Ini adalah deteksi sederhana, untuk deteksi yang lebih akurat
            // perlu listener pointer events
            pointerTypes.push("fine");
        }
        // Mouse selalu ada di desktop
        if (navigator.maxTouchPoints === 0) {
            pointerTypes.push("coarse");
        }
        return pointerTypes;
    }
}
//# sourceMappingURL=HardwareCollector.js.map