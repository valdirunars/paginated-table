/** Storage adapter interface – use localStorage for web, AsyncStorage for React Native. */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export type TranslationOptions = {
  fallback?: string;
  locale?: string;
  values?: Record<string, unknown>;
};

type StringKeyOf<T> = Extract<keyof T, string>;

type DottedPath<T> = T extends Record<string, unknown>
  ? {
      [K in StringKeyOf<T>]: T[K] extends string
        ? K
        : T[K] extends Record<string, unknown>
          ? `${K}.${DottedPath<T[K]>}`
          : never;
    }[StringKeyOf<T>]
  : never;

export type DottedLanguageObjectStringPaths<T extends Record<string, unknown>> =
  Extract<DottedPath<T>, string>;

export interface Localization<TKey extends string = string> {
  locale: string;
  setLocale: (locale: string) => void;
  translate: (dottedString: TKey, options?: TranslationOptions) => string;
}
