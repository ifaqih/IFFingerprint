/**
 * WebGL Collector
 * Mengumpulkan data dari WebGL API untuk fingerprinting GPU dan driver
 */
import { WebGLData } from "../types";
export declare class WebGLCollector {
    name: string;
    enabled: boolean;
    private cachedExtensions;
    collect(): Promise<WebGLData>;
    private getExtension;
    private collectParameters;
}
//# sourceMappingURL=WebGLCollector.d.ts.map