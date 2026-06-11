import { createLocalizationContext } from "./LocalizationContext";
import { translations } from "./translations";
import type {
  DottedLanguageObjectStringPaths,
  Localization,
  StorageAdapter,
} from "./types";

type LocaleStructure = (typeof translations)["is"];

const localStorageAdapter: StorageAdapter = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
};

const { Provider: LocalizationProvider, useLocalization } =
  createLocalizationContext<LocaleStructure>();

export { LocalizationProvider, useLocalization };
export type { DottedLanguageObjectStringPaths, Localization };

export const appLocalizationProviderProps = {
  storage: localStorageAdapter,
  translations,
  defaultLocale: "en" as const,
  storageKey: "paginated-table:locale",
};
