import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTranslation } from "./getTranslation";
import type {
  DottedLanguageObjectStringPaths,
  Localization,
  StorageAdapter,
  TranslationOptions,
} from "./types";

const STORAGE_KEY = "locale";

/** Shape of a single locale's translations (e.g. translations.is) */
export type LocaleTranslations = Record<string, unknown>;

export interface LocalizationProviderProps<
  TTranslations extends Record<string, LocaleTranslations>,
> {
  storage: StorageAdapter;
  translations: TTranslations;
  defaultLocale: keyof TTranslations & string;
  storageKey?: string;
  children: React.ReactNode;
}

export function createLocalizationContext<
  TLocaleStructure extends LocaleTranslations,
  TTranslations extends Record<
    string,
    TLocaleStructure
  > = Record<string, TLocaleStructure>,
>() {
  type TranslationKey = DottedLanguageObjectStringPaths<TLocaleStructure>;

  const Context = createContext<Localization<TranslationKey> | null>(null);

  function Provider({
    storage,
    translations,
    defaultLocale,
    storageKey = STORAGE_KEY,
    children,
  }: LocalizationProviderProps<TTranslations>) {
    const [locale, setLocaleState] = useState(defaultLocale);

    useEffect(() => {
      storage.getItem(storageKey).then((stored) => {
        if (stored && stored in translations) {
          setLocaleState(stored);
        }
      });
    }, [storage, storageKey, translations]);

    const setLocale = useCallback(
      (newLocale: string) => {
        if (!(newLocale in translations)) return;
        setLocaleState(newLocale);
        storage.setItem(storageKey, newLocale);
      },
      [storage, storageKey, translations],
    );

    const translate = useCallback(
      (dottedString: TranslationKey, options?: TranslationOptions) =>
        getTranslation(translations, dottedString, {
          locale,
          ...options,
        }),
      [translations, locale],
    );

    const value: Localization<TranslationKey> = {
      locale,
      setLocale,
      translate,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useLocalization(): Localization<TranslationKey> {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error(
        "useLocalization must be used within a LocalizationProvider",
      );
    }
    return ctx;
  }

  return { Provider, useLocalization, Context };
}
