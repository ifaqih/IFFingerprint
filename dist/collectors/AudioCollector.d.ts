/**
 * Audio Collector
 * Mengumpulkan data dari AudioContext API untuk fingerprinting
 * Teknik: Oscillator dan dynamics compressor untuk mendeteksi perbedaan audio processing
 */
import { AudioData } from "../types";
export declare class AudioCollector {
    name: string;
    enabled: boolean;
    collect(): Promise<AudioData>;
}
//# sourceMappingURL=AudioCollector.d.ts.map