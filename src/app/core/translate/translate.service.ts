import {Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_ES_NAME, LANG_ES_TRANS } from './lang-es';

@Injectable()
export class TranslationService {
    private CurrentLang: string;
    get currentLang() {
        return this.CurrentLang || localStorage.getItem('jd_preferredLang') || environment.language || 'en';
    }
    set currentLang(val: string) {
        this.CurrentLang = val;
        localStorage.setItem('jd_preferredLang', val);
    }

    private translations: any = {
        [LANG_EN_NAME]: LANG_EN_TRANS,
        [LANG_ES_NAME]: LANG_ES_TRANS,
    };

    constructor() {
    }

    public use(lang: string): void {
        // set current language
        this.currentLang = lang;
    }

    public translate(key: string): string {
        const translation = key;
        const currentLang = this.currentLang;

        if (this.translations[currentLang] && this.translations[currentLang][key]) {
            return this.translations[currentLang][key];
        }

        return translation;
    }
}
