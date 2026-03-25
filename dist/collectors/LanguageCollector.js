/**
 * Language Collector
 * Mengumpulkan data bahasa dari browser
 */
import { hashString } from '../utils';
export class LanguageCollector {
    constructor() {
        this.name = 'language';
        this.enabled = true;
    }
    collect() {
        const languages = navigator.languages?.length > 0
            ? Array.from(navigator.languages)
            : [navigator.language || 'en'];
        const primary = languages[0] || 'en';
        return {
            primary: primary,
            all: languages,
            hash: hashString(languages.join(',')),
        };
    }
}
//# sourceMappingURL=LanguageCollector.js.map