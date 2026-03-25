/**
 * Canvas Collector
 * Mengumpulkan data fingerprint dari Canvas API
 * Teknik: Rendering teks, emoji, dan geometri untuk mendeteksi perbedaan rendering
 */
import { CanvasData } from "../types";
export declare class CanvasCollector {
    name: string;
    enabled: boolean;
    private canvas;
    private ctx;
    collect(): Promise<CanvasData>;
    private clearCanvas;
    private renderText;
    private renderGeometry;
    private renderEmoji;
    private renderWinding;
    private canvasToString;
}
//# sourceMappingURL=CanvasCollector.d.ts.map