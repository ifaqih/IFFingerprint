/**
 * Connection Collector
 * Mengumpulkan data network connection
 */

import { ConnectionData } from '../types';

export class ConnectionCollector {
  name = 'connection';
  enabled = true;

  collect(): ConnectionData {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;

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
