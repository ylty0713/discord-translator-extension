import "./content.css";
import { translateComposerInput } from "./input";
import { mountMessageObserver } from "./observer";
import type { ExtensionSettings } from "../storage/settings";

let currentSettings: ExtensionSettings | null = null;
let currentObserver: MutationObserver | null = null;
let rescanTimer: number | null = null;

const STORAGE_KEY = "discordTranslatorSettings";

const defaultContentSettings: ExtensionSettings = {
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

async function getContentSettings(): Promise<ExtensionSettings> {
  const result = await getStorageArea().get(STORAGE_KEY);

  return {
    ...defaultContentSettings,
    ...(result[STORAGE_KEY] as Partial<ExtensionSettings> | undefined)
  };
}

function watchContentSettings(
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
        ...defaultContentSettings,
        ...(changes[STORAGE_KEY].newValue as Partial<ExtensionSettings>)
      });
    }
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}

async function translateMessage(text: string): Promise<string> {
  const response = await chrome.runtime.sendMessage({
    type: "TRANSLATE_TEXT",
    payload: { text }
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "Failed to translate message");
  }

  return response.translatedText as string;
}

function restartObserver(settings: ExtensionSettings): void {
  currentObserver?.disconnect();
  currentObserver = null;

  if (rescanTimer !== null) {
    window.clearInterval(rescanTimer);
    rescanTimer = null;
  }

  if (!settings.enabled) {
    return;
  }

  currentObserver = mountMessageObserver({
    settings,
    onTranslate: translateMessage
  });

  rescanTimer = window.setInterval(() => {
    currentObserver?.disconnect();
    currentObserver = mountMessageObserver({
      settings,
      onTranslate: translateMessage
    });
  }, 3000);
}

async function bootstrap(): Promise<void> {
  currentSettings = await getContentSettings();
  restartObserver(currentSettings);

  watchContentSettings((settings) => {
    currentSettings = settings;
    restartObserver(settings);
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "TRIGGER_COMPOSER_TRANSLATION") {
    void (async () => {
      try {
        if (!currentSettings) {
          currentSettings = await getContentSettings();
        }

        await translateComposerInput(currentSettings);
        sendResponse({ ok: true });
      } catch (error) {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : "Composer translation failed"
        });
      }
    })();

    return true;
  }

  return false;
});

void bootstrap();
