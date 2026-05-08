import { translateWithClaude } from "../api/claude";
import { translateWithDeepSeek } from "../api/deepseek";
import { translateWithGemini } from "../api/gemini";
import { translateWithGoogle } from "../api/google";
import { translateWithLibre } from "../api/libre";
import { translateWithOpenAI } from "../api/openai";
import type { ExtensionSettings } from "../storage/settings";
import { TranslationCache } from "../utils/cache";
import { AsyncQueue } from "../utils/queue";

export const translationCache = new TranslationCache();

let queue = new AsyncQueue(2);

export function updateTranslatorConfig(settings: ExtensionSettings): void {
  queue = new AsyncQueue(Math.max(1, settings.maxConcurrentJobs));
}

export async function translateText(
  text: string,
  settings: ExtensionSettings
): Promise<string> {
  const cacheKey = [
    settings.engine,
    settings.sourceLanguage,
    settings.targetLanguage,
    settings.model,
    text
  ].join("::");

  const cached = translationCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const translatedText = await queue.run(async () => {
    switch (settings.engine) {
      case "google":
        return translateWithGoogle(
          text,
          settings.sourceLanguage,
          settings.targetLanguage
        );
      case "libre":
        return translateWithLibre(
          text,
          settings.sourceLanguage,
          settings.targetLanguage,
          settings.apiBaseUrl
        );
      case "openai":
        return translateWithOpenAI(
          text,
          settings.sourceLanguage,
          settings.targetLanguage,
          settings.apiKey,
          settings.apiBaseUrl,
          settings.model
        );
      case "claude":
        return translateWithClaude(
          text,
          settings.sourceLanguage,
          settings.targetLanguage,
          settings.apiKey,
          settings.model
        );
      case "gemini":
        return translateWithGemini(
          text,
          settings.sourceLanguage,
          settings.targetLanguage,
          settings.apiKey,
          settings.model
        );
      case "deepseek":
        return translateWithDeepSeek(
          text,
          settings.sourceLanguage,
          settings.targetLanguage,
          settings.apiKey,
          settings.model
        );
      default:
        return text;
    }
  });

  translationCache.set(cacheKey, translatedText);
  return translatedText;
}
