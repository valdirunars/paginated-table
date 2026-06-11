import { get } from "./get";
import type { TranslationOptions } from "./types";

export function getTranslation<
  TTranslations extends Record<string, Record<string, unknown>>,
>(
  translations: TTranslations,
  dottedString: string,
  options?: TranslationOptions,
): string {
  const { locale, fallback, values } = options || {};
  const defaultLocale = Object.keys(translations)[0] ?? "en";

  const interpolate = (translation: string) =>
    translation.replace(/\{\{(\w+)\}\}/g, (_: string, v: string) => {
      const interpolated = get(values, v, v);
      return String(interpolated ?? v);
    });

  const translationToInterpolate = get(
    translations,
    `${locale ?? defaultLocale}.${dottedString}`,
    fallback ?? dottedString,
  );

  return interpolate(String(translationToInterpolate ?? dottedString));
}
