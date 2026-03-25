/**
 * Touch Collector
 * Mengumpulkan data touch support
 */

import { TouchData } from '../types';

export class TouchCollector {
  name = 'touch';
  enabled = true;

  collect(): TouchData {
    const available = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const points = navigator.maxTouchPoints || 0;
    const events = this.getSupportedTouchEvents();

    return {
      available,
      points,
      events,
    };
  }

  private getSupportedTouchEvents(): string[] {
    const events: string[] = [];
    const testEvents = [
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel',
      'touchenter',
      'touchleave',
      'gesturestart',
      'gesturechange',
      'gestureend',
    ];

    for (const event of testEvents) {
      if (`on${event}` in window) {
        events.push(event);
      }
    }

    return events;
  }
}
