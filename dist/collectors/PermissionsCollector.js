/**
 * Permissions Collector
 * Mengumpulkan data permissions yang didukung
 */
export class PermissionsCollector {
    constructor() {
        this.name = 'permissions';
        this.enabled = true;
        this.testPermissions = [
            'geolocation',
            'notifications',
            'push',
            'microphone',
            'camera',
            'midi',
            'clipboard-read',
            'clipboard-write',
            'persistent-storage',
            'ambient-light-sensor',
            'accelerometer',
            'gyroscope',
            'magnetometer',
            'display-capture',
            'speaker-selection',
            'screen-wake-lock',
            'background-fetch',
            'background-sync',
            'bluetooth',
            'nfc',
            'idle-detection',
            'periodic-background-sync',
            'storage-access',
        ];
    }
    async collect() {
        const result = {
            available: false,
            supported: [],
            states: {},
        };
        if (!navigator.permissions) {
            return result;
        }
        result.available = true;
        for (const permission of this.testPermissions) {
            try {
                const status = await navigator.permissions.query({ name: permission });
                result.supported.push(permission);
                result.states[permission] = status.state;
            }
            catch (error) {
                // Permission tidak didukung
            }
        }
        return result;
    }
}
//# sourceMappingURL=PermissionsCollector.js.map