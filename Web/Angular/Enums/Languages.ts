module Languages {
    export interface ILanguage {
      id: number;
      culture: string;
      name: string;
      text: string;
      tier: number;
    }

    // First Tier
    export const english   : ILanguage = { id: 1, tier: 1, culture: "en",    name: "english",    text: "English" };
    export const spanish   : ILanguage = { id: 2, tier: 1, culture: "es",    name: "spanish",    text: "Español" };
    export const french    : ILanguage = { id: 3, tier: 1, culture: "fr",    name: "french",     text: "Français" };
    export const japanese  : ILanguage = { id: 4, tier: 1, culture: "ja",    name: "japanese",   text: "日本語" };
    export const german    : ILanguage = { id: 5, tier: 1, culture: "de",    name: "german",     text: "Deutsch" };
    export const italian   : ILanguage = { id: 6, tier: 1, culture: "it",    name: "italian",    text: "Italiano" };
    export const chinese   : ILanguage = { id: 7, tier: 1, culture: "zh-CN", name: "chinese",    text: "中文" };
    export const russian   : ILanguage = { id: 8, tier: 1, culture: "ru",    name: "russian",    text: "Русский" };
    export const portuguese: ILanguage = { id: 9, tier: 1, culture: "pt-BR", name: "portuguese", text: "Português" };
    export const korean    : ILanguage = { id: 11, tier: 1, culture: "ko",   name: "korean",     text: "한국어" };

    // Second Tier
    export const arabic    : ILanguage = { id: 10, tier: 2, culture: "##", name: "arabic",     text: "العربية" };
    export const bengali   : ILanguage = { id: 44, tier: 2, culture: "##", name: "bengali",    text: "বাংলা" };
    export const bosnian   : ILanguage = { id: 46, tier: 2, culture: "##", name: "bosnian",    text: "Bosanski" };
    export const bulgarian : ILanguage = { id: 45, tier: 2, culture: "##", name: "bulgarian",  text: "Български" };
    export const cantonese : ILanguage = { id: 13, tier: 2, culture: "##", name: "cantonese",  text: "广东话" };
    export const catalan   : ILanguage = { id: 50, tier: 2, culture: "##", name: "catalan",    text: "Català" };
    export const croatian  : ILanguage = { id: 41, tier: 2, culture: "##", name: "croatian",   text: "Hrvatski" };
    export const czech     : ILanguage = { id: 38, tier: 2, culture: "##", name: "czech",      text: "Čeština" };
    export const danish    : ILanguage = { id: 35, tier: 2, culture: "##", name: "danish",     text: "Dansk" };
    export const dutch     : ILanguage = { id: 15, tier: 2, culture: "##", name: "dutch",      text: "Nederlands" };
    export const esperanto : ILanguage = { id: 63, tier: 2, culture: "##", name: "esperanto",  text: "Esperanto" };
    export const finnish   : ILanguage = { id: 30, tier: 2, culture: "##", name: "finnish",    text: "Suomi" };
    export const greek     : ILanguage = { id: 19, tier: 2, culture: "##", name: "greek",      text: "Ελληνικά" };
    export const hebrew    : ILanguage = { id: 29, tier: 2, culture: "##", name: "hebrew",     text: "עברית" };
    export const hindi     : ILanguage = { id: 12, tier: 2, culture: "##", name: "hindi",      text: "हिन्दी" };
    export const hungarian : ILanguage = { id: 36, tier: 2, culture: "##", name: "hungarian",  text: "Magyar" };
    export const icelandic : ILanguage = { id: 47, tier: 2, culture: "##", name: "icelandic",  text: "Íslenska" };
    export const indonesian: ILanguage = { id: 34, tier: 2, culture: "##", name: "indonesian", text: "Bahasa Indonesia" };
    export const irish     : ILanguage = { id: 33, tier: 2, culture: "##", name: "irish",      text: "Gaeilge" };
    export const lithuanian: ILanguage = { id: 57, tier: 2, culture: "##", name: "lithuanian", text: "Lietuvių" };
    export const norwegian : ILanguage = { id: 26, tier: 2, culture: "##", name: "norwegian",  text: "Norsk" };
    export const persian   : ILanguage = { id: 21, tier: 2, culture: "##", name: "persian",    text: "فارسی" };
    export const polish    : ILanguage = { id: 23, tier: 2, culture: "##", name: "polish",     text: "Polski" };
    export const romanian  : ILanguage = { id: 25, tier: 2, culture: "##", name: "romanian",   text: "Română" };
    export const serbian   : ILanguage = { id: 31, tier: 2, culture: "##", name: "serbian",    text: "Српски/srpski" };
    export const slovak    : ILanguage = { id: 56, tier: 2, culture: "##", name: "slovak",     text: "Slovenčina" };
    export const slovenian : ILanguage = { id: 62, tier: 2, culture: "##", name: "slovenian",  text: "Slovenščina" };
    export const swahili   : ILanguage = { id: 43, tier: 2, culture: "##", name: "swahili",    text: "Kiswahili" };
    export const swedish   : ILanguage = { id: 18, tier: 2, culture: "##", name: "swedish",    text: "Svenska" };
    export const tagalog   : ILanguage = { id: 14, tier: 2, culture: "##", name: "tagalog",    text: "Tagalog" };
    export const thai      : ILanguage = { id: 22, tier: 2, culture: "##", name: "thai",       text: "ไทย" };
    export const turkish   : ILanguage = { id: 17, tier: 2, culture: "##", name: "turkish",    text: "Türkçe" };
    export const ukrainian : ILanguage = { id: 55, tier: 2, culture: "##", name: "ukrainian",  text: "Українська" };
    export const urdu      : ILanguage = { id: 16, tier: 2, culture: "##", name: "urdu",       text: "اُردُو" };
    export const vietnamese: ILanguage = { id: 27, tier: 2, culture: "##", name: "vietnamese", text: "Tiếng Việt" };
    export const estonian  : ILanguage = { id: 69, tier: 2, culture: "##", name: "estonian",   text: "Eesti" };
    export const albanian  : ILanguage = { id: 53, tier: 2, culture: "##", name: "albanian",   text: "Shqip" };
    export const latvian   : ILanguage = { id: 65, tier: 2, culture: "##", name: "latvian",    text: "Latviešu" };
    export const malay     : ILanguage = { id: 28, tier: 2, culture: "##", name: "malay",      text: "Bahasa Melayu" };
    export const mongolian : ILanguage = { id: 81, tier: 2, culture: "##", name: "mongolian",  text: "Монгол" };
    export const macedonian: ILanguage = { id: 84, tier: 2, culture: "##", name: "macedonian", text: "Македонски" };
    export const kazakh    : ILanguage = { id: 89, tier: 2, culture: "##", name: "kazakh",     text: "Қазақ" };
    export const belarusian: ILanguage = { id: 94, tier: 2, culture: "##", name: "belarusian", text: "Беларуская" };
    export const georgian  : ILanguage = { id: 82, tier: 2, culture: "##", name: "georgian",   text: "ქართული" };
    export const armenian  : ILanguage = { id: 51, tier: 2, culture: "##", name: "armenian",   text: "Հայերեն" };

	// Build a list of language by Id. Note that we enumerate Languages before exporting langsById to prevent the later from being part of the enumeration
	var langsByIdBuilder: ILanguage[] = [];
	for (var i in Languages) langsByIdBuilder[(Languages[i] as ILanguage).id] = Languages[i];
	export const langsById = langsByIdBuilder;

}