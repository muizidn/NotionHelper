export enum Language {
    Albanian = 'albanian',
    Arabic = 'arabic',
    Azerbaijani = 'azeri',
    Bengali = 'bengali',
    Bulgarian = 'bulgarian',
    Cebuano = 'cebuano',
    Croatian = 'croatian',
    Czech = 'czech',
    Danish = 'danish',
    Dutch = 'dutch',
    English = 'english',
    Estonian = 'estonian',
    Farsi = 'farsi',
    Finnish = 'finnish',
    French = 'french',
    German = 'german',
    Hausa = 'hausa',
    Hawaiian = 'hawaiian',
    Hindi = 'hindi',
    Hungarian = 'hungarian',
    Icelandic = 'icelandic',
    Indonesian = 'indonesian',
    Italian = 'italian',
    Kazakh = 'kazakh',
    Kyrgyz = 'kyrgyz',
    Latin = 'latin',
    Latvian = 'latvian',
    Lithuanian = 'lithuanian',
    Macedonian = 'macedonian',
    Mongolian = 'mongolian',
    Nepali = 'nepali',
    Norwegian = 'norwegian',
    Pashto = 'pashto',
    Pidgin = 'pidgin',
    Polish = 'polish',
    Portuguese = 'portuguese',
    Romanian = 'romanian',
    Russian = 'russian',
    Serbian = 'serbian',
    Slovak = 'slovak',
    Slovene = 'slovene',
    Somali = 'somali',
    Spanish = 'spanish',
    Swahili = 'swahili',
    Swedish = 'swedish',
    Tagalog = 'tagalog',
    Turkish = 'turkish',
    Ukrainian = 'ukrainian',
    Urdu = 'urdu',
    Uzbek = 'uzbek',
    Vietnamese = 'vietnamese',
    Welsh = 'welsh',
}

function initializeLanguage(languageStr: string): Language | undefined {
    const languageKey = languageStr.toLowerCase() as keyof typeof Language;
    
    if (languageKey in Language) {
        return Language[languageKey];
    } else {
        return undefined;
    }
}

export function detectLanguage(text: string): Language {
    const lang = initializeLanguage('pidgin');
    return lang ?? Language.English;
}

const koreanPattern = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7A3\uFFA1-\uFFDC]+/g;

export function isShouldTranslate(text: string): boolean {
    // return text.match(koreanPattern) !== null;
    return detectLanguage(text) == Language.English
}