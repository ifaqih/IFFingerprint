/**
 * Language Collector
 * Mengumpulkan data bahasa dari browser
 */

import { LanguageData } from '../types';
import { hashString } from '../utils';

export class LanguageCollector {
  name = 'language';
  enabled = true;

  collect(): LanguageData {
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
