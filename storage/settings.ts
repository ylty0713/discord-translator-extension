export type TranslationEngine =
  | "google"
  | "libre"
  | "openai"
  | "claude"
  | "gemini"
  | "deepseek";

export type TranslationMode = "manual" | "auto";

export type SystemLanguage = "en" | "zh-CN" | "ja" | "zh-TW" | "fr";

export interface ExtensionSettings {
  systemLanguage: SystemLanguage;
  enabled: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  translationMode: TranslationMode;
  writingTranslationEnabled: boolean;
  writingShortcut: string;
  aiMode: boolean;
  engine: TranslationEngine;
  apiKey: string;
  apiBaseUrl: string;
  model: string;
  showBilingual: boolean;
  autoTranslateVisibleOnly: boolean;
  maxConcurrentJobs: number;
}

const STORAGE_KEY = "discordTranslatorSettings";

export const defaultSettings: ExtensionSettings = {
  systemLanguage: "en",
  enabled: true,
  sourceLanguage: "auto",
  targetLanguage: "zh-CN",
  translationMode: "manual",
  writingTranslationEnabled: true,
  writingShortcut: "Ctrl+Shift+T",
  aiMode: false,
  engine: "google",
  apiKey: "",
  apiBaseUrl: "",
  model: "gpt-4o-mini",
  showBilingual: true,
  autoTranslateVisibleOnly: true,
  maxConcurrentJobs: 2
};

function getStorageArea() {
  return chrome.storage?.sync ?? chrome.storage.local;
}

export async function getSettings(): Promise<ExtensionSettings> {
  const storage = getStorageArea();
  const result = await storage.get(STORAGE_KEY);

  return {
    ...defaultSettings,
    ...(result[STORAGE_KEY] as Partial<ExtensionSettings> | undefined)
  };
}

export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  const storage = getStorageArea();
  await storage.set({
    [STORAGE_KEY]: settings
  });
}

export function watchSettings(
  callback: (settings: ExtensionSettings) => void
): () => void {
  const listener = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string
  ) => {
    if (areaName !== "sync" && areaName !== "local") {
      return;
    }

    if (changes[STORAGE_KEY]?.newValue) {
      callback({
        ...defaultSettings,
        ...(changes[STORAGE_KEY].newValue as Partial<ExtensionSettings>)
      });
    }
  };

  chrome.storage.onChanged.addListener(listener);

  return () => chrome.storage.onChanged.removeListener(listener);
}
