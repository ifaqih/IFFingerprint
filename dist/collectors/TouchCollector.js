/**
 * Touch Collector
 * Mengumpulkan data touch support
 */
export class TouchCollector {
    constructor() {
        this.name = 'touch';
        this.enabled = true;
    }
    collect() {
        const available = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const points = navigator.maxTouchPoints || 0;
        const events = this.getSupportedTouchEvents();
        return {
            available,
            points,
            events,
        };
    }
    getSupportedTouchEvents() {
        const events = [];
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
//# sourceMappingURL=TouchCollector.js.map