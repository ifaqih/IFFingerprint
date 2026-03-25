/**
 * Media Devices Collector
 * Mengumpulkan data media devices
 */

import { MediaDevicesData } from '../types';
import { hashString } from '../utils';

export class MediaDevicesCollector {
  name = 'mediaDevices';
  enabled = true;

  async collect(): Promise<MediaDevicesData> {
    const result: MediaDevicesData = {
      available: false,
      count: 0,
      deviceIds: [],
      kinds: {
        audioinput: 0,
        audiooutput: 0,
        videoinput: 0,
      },
    };

    if (!navigator.mediaDevices) {
      return result;
    }

    try {
      result.available = true;
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      result.count = devices.length;
      result.deviceIds = devices.map(d => hashString(d.deviceId || ''));
      
      for (const device of devices) {
        if (device.kind === 'audioinput') {
          result.kinds.audioinput++;
        } else if (device.kind === 'audiooutput') {
          result.kinds.audiooutput++;
        } else if (device.kind === 'videoinput') {
          result.kinds.videoinput++;
        }
      }
    } catch (error) {
      console.warn('MediaDevicesCollector error:', error);
    }

    return result;
  }
}
