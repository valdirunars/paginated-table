import { en } from "./locales/en";
import { is } from "./locales/is";
import type { DottedLanguageObjectStringPaths as DottedKeyPaths } from "./types";
import type { Localization } from "./types";

export const translations = {
  is,
  en,
};

export type Locale = keyof typeof translations;

export const localeDisplay: Record<
  Locale,
  { emoji: string; languageName: string }
> = {
  is: { emoji: "🇮🇸", languageName: "Íslenska" },
  en: { emoji: "🇺🇸", languageName: "English" },
};

export const locales = Object.keys(translations) as Locale[];

/** Dotted translation keys derived from the Icelandic locale structure. */
export type DottedLanguageObjectStringPaths = DottedKeyPaths<typeof is>;
export type TranslateFn = Localization<DottedLanguageObjectStringPaths>["translate"];
