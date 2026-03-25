/**
 * Permissions Collector
 * Mengumpulkan data permissions yang didukung
 */

import { PermissionsData } from '../types';

export class PermissionsCollector {
  name = 'permissions';
  enabled = true;

  private readonly testPermissions = [
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

  async collect(): Promise<PermissionsData> {
    const result: PermissionsData = {
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
        const status = await navigator.permissions.query({ name: permission as PermissionName });
        result.supported.push(permission);
        result.states[permission] = status.state;
      } catch (error) {
        // Permission tidak didukung
      }
    }

    return result;
  }
}
