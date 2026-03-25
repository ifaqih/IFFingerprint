/**
 * Speech Collector
 * Menggunakan Web Speech API untuk fingerprinting
 * Teknik: Voice synthesis dan recognition bervariasi antar browser/system
 */
export interface SpeechData {
    available: boolean;
    voices: string[];
    voiceCount: number;
    defaultVoice: string | null;
    languages: string[];
    hash: string;
}
export declare class SpeechCollector {
    name: string;
    enabled: boolean;
    collect(): Promise<SpeechData>;
    private waitForVoices;
    private hashString;
}
//# sourceMappingURL=SpeechCollector.d.ts.map