import type { ExtensionSettings } from "../storage/settings";

async function requestTranslation(text: string): Promise<string> {
  const response = await chrome.runtime.sendMessage({
    type: "TRANSLATE_TEXT",
    payload: { text }
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "Failed to translate composer text");
  }

  return response.translatedText as string;
}

export function findComposer(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>('[role="textbox"][data-slate-editor="true"]') ??
    document.querySelector<HTMLElement>('[role="textbox"]')
  );
}

export async function translateComposerInput(
  settings: ExtensionSettings
): Promise<void> {
  if (!settings.writingTranslationEnabled) {
    return;
  }

  const composer = findComposer();

  if (!composer) {
    return;
  }

  const text = composer.innerText.trim();

  if (!text) {
    return;
  }

  const translatedText = await requestTranslation(text);
  composer.focus();
  document.execCommand("selectAll", false);
  document.execCommand("insertText", false, translatedText);
}
