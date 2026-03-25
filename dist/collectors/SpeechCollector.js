/**
 * Speech Collector
 * Menggunakan Web Speech API untuk fingerprinting
 * Teknik: Voice synthesis dan recognition bervariasi antar browser/system
 */
export class SpeechCollector {
    constructor() {
        this.name = "speech";
        this.enabled = true;
    }
    async collect() {
        const result = {
            available: false,
            voices: [],
            voiceCount: 0,
            defaultVoice: null,
            languages: [],
            hash: "",
        };
        try {
            if (!window.speechSynthesis) {
                return result;
            }
            result.available = true;
            // Wait for voices to load
            await this.waitForVoices();
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                result.voices = voices.map((v) => `${v.name}|${v.lang}|${v.gender || ""}`);
                result.voiceCount = voices.length;
                // Find default voice
                const defaultVoice = voices.find((v) => v.default);
                if (defaultVoice) {
                    result.defaultVoice = `${defaultVoice.name}|${defaultVoice.lang}`;
                }
                // Get unique languages
                const langs = new Set(voices.map((v) => v.lang));
                result.languages = Array.from(langs);
            }
            // Generate hash
            const hashData = JSON.stringify({
                voices: result.voices,
                voiceCount: result.voiceCount,
                defaultVoice: result.defaultVoice,
                languages: result.languages,
            });
            result.hash = this.hashString(hashData);
        }
        catch (error) {
            console.warn("SpeechCollector error:", error);
        }
        return result;
    }
    async waitForVoices() {
        return new Promise((resolve) => {
            // Voices may load asynchronously
            if (window.speechSynthesis.getVoices().length > 0) {
                resolve();
                return;
            }
            window.speechSynthesis.onvoiceschanged = () => {
                resolve();
            };
            // Timeout fallback
            setTimeout(resolve, 1000);
        });
    }
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return (hash >>> 0).toString(16).padStart(8, "0");
    }
}
//# sourceMappingURL=SpeechCollector.js.map