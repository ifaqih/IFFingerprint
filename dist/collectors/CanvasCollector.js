/**
 * Canvas Collector
 * Mengumpulkan data fingerprint dari Canvas API
 * Teknik: Rendering teks, emoji, dan geometri untuk mendeteksi perbedaan rendering
 */
import { hashString } from "../utils";
export class CanvasCollector {
    constructor() {
        this.name = "canvas";
        this.enabled = true;
        // ✅ OPTIMIZATION: Reuse canvas untuk semua tests (no accuracy loss)
        this.canvas = null;
        this.ctx = null;
    }
    async collect() {
        const result = {
            available: false,
            hash: "",
            geometry: "",
            text: "",
            emoji: "",
            winding: false,
            imageSmoothingEnabled: false,
        };
        try {
            // ✅ CREATE ONCE
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            if (!this.ctx) {
                return result;
            }
            result.available = true;
            this.canvas.width = 200;
            this.canvas.height = 50;
            // Image smoothing detection
            result.imageSmoothingEnabled = this.ctx.imageSmoothingEnabled;
            // ✅ REUSE CANVAS: Clear sebelum setiap test
            result.text = this.renderText();
            this.clearCanvas();
            result.geometry = this.renderGeometry();
            this.clearCanvas();
            result.emoji = this.renderEmoji();
            this.clearCanvas();
            result.winding = this.renderWinding();
            // Generate combined hash
            const combined = result.text + result.geometry + result.emoji;
            result.hash = hashString(combined);
            // ✅ CLEANUP
            this.canvas = null;
            this.ctx = null;
        }
        catch (error) {
            console.warn("CanvasCollector error:", error);
        }
        return result;
    }
    clearCanvas() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    renderText() {
        if (!this.ctx || !this.canvas)
            return "";
        this.ctx.textBaseline = "top";
        this.ctx.font = "14px Arial";
        this.ctx.textBaseline = "alphabetic";
        this.ctx.fillStyle = "#f60";
        this.ctx.fillRect(125, 1, 62, 20);
        this.ctx.fillStyle = "#069";
        this.ctx.fillText("IFFingerprint 🏔️", 2, 15);
        this.ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        this.ctx.fillText("IFFingerprint 🏔️", 4, 17);
        return this.canvasToString();
    }
    renderGeometry() {
        if (!this.ctx || !this.canvas)
            return "";
        this.canvas.width = 200;
        this.canvas.height = 50;
        this.ctx.fillStyle = "#EB5D5C";
        this.ctx.beginPath();
        this.ctx.arc(50, 25, 20, 0, Math.PI * 2, true);
        this.ctx.arc(100, 25, 20, 0, Math.PI * 2, true);
        this.ctx.arc(150, 25, 20, 0, Math.PI * 2, true);
        this.ctx.fill();
        return this.canvasToString();
    }
    renderEmoji() {
        if (!this.ctx || !this.canvas)
            return "";
        this.canvas.width = 100;
        this.canvas.height = 50;
        this.ctx.font = "30px Arial";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("🤔", 0, 0);
        return this.canvasToString();
    }
    renderWinding() {
        if (!this.ctx || !this.canvas)
            return false;
        this.canvas.width = 100;
        this.canvas.height = 100;
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(100, 0);
        this.ctx.lineTo(100, 100);
        this.ctx.lineTo(0, 100);
        this.ctx.lineTo(0, 0);
        this.ctx.moveTo(25, 25);
        this.ctx.lineTo(75, 25);
        this.ctx.lineTo(75, 75);
        this.ctx.lineTo(25, 75);
        this.ctx.lineTo(25, 25);
        this.ctx.fill("evenodd");
        return true;
    }
    canvasToString() {
        if (!this.canvas)
            return "";
        try {
            return this.canvas.toDataURL();
        }
        catch {
            return "";
        }
    }
}
//# sourceMappingURL=CanvasCollector.js.map