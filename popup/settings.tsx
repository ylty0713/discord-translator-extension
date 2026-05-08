import {
  useEffect,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes
} from "react";
import {
  defaultSettings,
  getSettings,
  saveSettings,
  type ExtensionSettings,
  type SystemLanguage,
  type TranslationEngine
} from "../storage/settings";
import { languageOptions } from "../utils/language";

const engineOptions: Array<{ label: string; value: TranslationEngine }> = [
  { label: "Google Translate", value: "google" },
  { label: "LibreTranslate", value: "libre" },
  { label: "OpenAI", value: "openai" },
  { label: "Claude", value: "claude" },
  { label: "Gemini", value: "gemini" },
  { label: "DeepSeek", value: "deepseek" }
];

const systemLanguageOptions: Array<{ label: string; value: SystemLanguage }> = [
  { label: "English", value: "en" },
  { label: "\u4e2d\u6587", value: "zh-CN" },
  { label: "\u65e5\u672c\u8a9e", value: "ja" },
  { label: "\u7e41\u9ad4\u4e2d\u6587", value: "zh-TW" },
  { label: "Francais", value: "fr" }
];

const popupCopy = {
  en: {
    brand: "Discord Translator",
    title: "Settings",
    subtitle: "Tune message translation, writing assist, and AI engines.",
    saved: "Saved",
    systemLanguage: "System language",
    translation: "Translation",
    mode: "Mode",
    sourceLanguage: "Source",
    targetLanguage: "Target",
    translationEngine: "Engine",
    model: "Model",
    apiKey: "API key",
    customApiBaseUrl: "API base URL",
    writingShortcutLabel: "Writing shortcut",
    writing: "Writing",
    bilingual: "Bilingual",
    visibleOnly: "Visible only",
    aiMode: "AI mode",
    maxConcurrentJobs: "Concurrency",
    supportTitle: "Support",
    donate: "Donate",
    follow: "Follow on X",
    enterApiKey: "Enter your API key",
    optionalCustomEndpoint: "Optional custom endpoint",
    shortcutPlaceholder: "Ctrl+Shift+T",
    modelPlaceholder: "gpt-4o-mini / claude-3-5-sonnet / gemini-1.5-flash",
    on: "On",
    off: "Off",
    auto: "Auto",
    manual: "Manual"
  },
  "zh-CN": {
    brand: "Discord \u7ffb\u8bd1\u5668",
    title: "\u8bbe\u7f6e",
    subtitle: "\u8c03\u6574\u6d88\u606f\u7ffb\u8bd1\u3001\u8f93\u5165\u8f85\u52a9\u548c AI \u5f15\u64ce\u3002",
    saved: "\u5df2\u4fdd\u5b58",
    systemLanguage: "\u7cfb\u7edf\u8bed\u8a00",
    translation: "\u7ffb\u8bd1",
    mode: "\u6a21\u5f0f",
    sourceLanguage: "\u6e90\u8bed\u8a00",
    targetLanguage: "\u76ee\u6807\u8bed\u8a00",
    translationEngine: "\u7ffb\u8bd1\u5f15\u64ce",
    model: "\u6a21\u578b",
    apiKey: "API Key",
    customApiBaseUrl: "API \u5730\u5740",
    writingShortcutLabel: "\u8f93\u5165\u5feb\u6377\u952e",
    writing: "\u8f93\u5165\u7ffb\u8bd1",
    bilingual: "\u53cc\u8bed\u663e\u793a",
    visibleOnly: "\u4ec5\u53ef\u89c6",
    aiMode: "AI \u6a21\u5f0f",
    maxConcurrentJobs: "\u5e76\u53d1\u6570",
    supportTitle: "\u652f\u6301",
    donate: "\u6253\u8d4f",
    follow: "\u5173\u6ce8 X",
    enterApiKey: "\u8f93\u5165\u4f60\u7684 API Key",
    optionalCustomEndpoint: "\u53ef\u9009\u7684\u81ea\u5b9a\u4e49\u63a5\u53e3",
    shortcutPlaceholder: "Ctrl+Shift+T",
    modelPlaceholder: "gpt-4o-mini / claude-3-5-sonnet / gemini-1.5-flash",
    on: "\u5f00",
    off: "\u5173",
    auto: "\u81ea\u52a8",
    manual: "\u624b\u52a8"
  },
  ja: {
    brand: "Discord \u7ffb\u8a33",
    title: "\u8a2d\u5b9a",
    subtitle: "\u30e1\u30c3\u30bb\u30fc\u30b8\u7ffb\u8a33\u3001\u5165\u529b\u652f\u63f4\u3001AI \u30a8\u30f3\u30b8\u30f3\u3092\u8abf\u6574\u3057\u307e\u3059\u3002",
    saved: "\u4fdd\u5b58\u3057\u307e\u3057\u305f",
    systemLanguage: "\u30b7\u30b9\u30c6\u30e0\u8a00\u8a9e",
    translation: "\u7ffb\u8a33",
    mode: "\u30e2\u30fc\u30c9",
    sourceLanguage: "\u5143\u8a00\u8a9e",
    targetLanguage: "\u5bfe\u8c61\u8a00\u8a9e",
    translationEngine: "\u7ffb\u8a33\u30a8\u30f3\u30b8\u30f3",
    model: "\u30e2\u30c7\u30eb",
    apiKey: "API \u30ad\u30fc",
    customApiBaseUrl: "API URL",
    writingShortcutLabel: "\u5165\u529b\u30b7\u30e7\u30fc\u30c8\u30ab\u30c3\u30c8",
    writing: "\u5165\u529b\u7ffb\u8a33",
    bilingual: "\u4e8c\u8a00\u8a9e",
    visibleOnly: "\u8868\u793a\u7bc4\u56f2",
    aiMode: "AI \u30e2\u30fc\u30c9",
    maxConcurrentJobs: "\u540c\u6642\u5b9f\u884c\u6570",
    supportTitle: "\u30b5\u30dd\u30fc\u30c8",
    donate: "\u30c1\u30c3\u30d7",
    follow: "X \u3092\u30d5\u30a9\u30ed\u30fc",
    enterApiKey: "API \u30ad\u30fc\u3092\u5165\u529b",
    optionalCustomEndpoint: "\u4efb\u610f\u306e\u30ab\u30b9\u30bf\u30e0\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8",
    shortcutPlaceholder: "Ctrl+Shift+T",
    modelPlaceholder: "gpt-4o-mini / claude-3-5-sonnet / gemini-1.5-flash",
    on: "\u30aa\u30f3",
    off: "\u30aa\u30d5",
    auto: "\u81ea\u52d5",
    manual: "\u624b\u52d5"
  },
  "zh-TW": {
    brand: "Discord \u7ffb\u8b6f\u5668",
    title: "\u8a2d\u5b9a",
    subtitle: "\u8abf\u6574\u8a0a\u606f\u7ffb\u8b6f\u3001\u8f38\u5165\u8f14\u52a9\u548c AI \u5f15\u64ce\u3002",
    saved: "\u5df2\u5132\u5b58",
    systemLanguage: "\u7cfb\u7d71\u8a9e\u8a00",
    translation: "\u7ffb\u8b6f",
    mode: "\u6a21\u5f0f",
    sourceLanguage: "\u4f86\u6e90\u8a9e\u8a00",
    targetLanguage: "\u76ee\u6a19\u8a9e\u8a00",
    translationEngine: "\u7ffb\u8b6f\u5f15\u64ce",
    model: "\u6a21\u578b",
    apiKey: "API Key",
    customApiBaseUrl: "API \u4f4d\u5740",
    writingShortcutLabel: "\u8f38\u5165\u5feb\u6377\u9375",
    writing: "\u8f38\u5165\u7ffb\u8b6f",
    bilingual: "\u96d9\u8a9e\u986f\u793a",
    visibleOnly: "\u50c5\u53ef\u8996",
    aiMode: "AI \u6a21\u5f0f",
    maxConcurrentJobs: "\u4e26\u884c\u6578",
    supportTitle: "\u652f\u6301",
    donate: "\u6253\u8cde",
    follow: "\u95dc\u6ce8 X",
    enterApiKey: "\u8f38\u5165\u4f60\u7684 API Key",
    optionalCustomEndpoint: "\u53ef\u9078\u7684\u81ea\u8a02\u7aef\u9ede",
    shortcutPlaceholder: "Ctrl+Shift+T",
    modelPlaceholder: "gpt-4o-mini / claude-3-5-sonnet / gemini-1.5-flash",
    on: "\u958b",
    off: "\u95dc",
    auto: "\u81ea\u52d5",
    manual: "\u624b\u52d5"
  },
  fr: {
    brand: "Traducteur Discord",
    title: "Parametres",
    subtitle: "Reglez la traduction, l'aide a la saisie et les moteurs IA.",
    saved: "Enregistre",
    systemLanguage: "Langue systeme",
    translation: "Traduction",
    mode: "Mode",
    sourceLanguage: "Source",
    targetLanguage: "Cible",
    translationEngine: "Moteur",
    model: "Modele",
    apiKey: "Cle API",
    customApiBaseUrl: "URL API",
    writingShortcutLabel: "Raccourci",
    writing: "Saisie",
    bilingual: "Bilingue",
    visibleOnly: "Visible seul.",
    aiMode: "Mode IA",
    maxConcurrentJobs: "Concurrence",
    supportTitle: "Soutien",
    donate: "Don",
    follow: "Suivre sur X",
    enterApiKey: "Entrez votre cle API",
    optionalCustomEndpoint: "Endpoint personnalise optionnel",
    shortcutPlaceholder: "Ctrl+Shift+T",
    modelPlaceholder: "gpt-4o-mini / claude-3-5-sonnet / gemini-1.5-flash",
    on: "Oui",
    off: "Non",
    auto: "Auto",
    manual: "Manuel"
  }
} satisfies Record<SystemLanguage, Record<string, string>>;

function Field({
  className = "",
  label,
  children
}: {
  className?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className={`setting-card ${className}`}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="control-input" />;
}

function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="control-input control-select" />;
}

function IconBadge({ children }: { children: ReactNode }) {
  return <span className="icon-badge">{children}</span>;
}

function ToggleCard({
  active,
  className = "",
  icon,
  label,
  value,
  onClick,
}: {
  active: boolean;
  className?: string;
  icon: ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`setting-card toggle-card ${className} ${
        active ? "primary-toggle" : "secondary-toggle"
      }`}
    >
      <IconBadge>{icon}</IconBadge>
      <span className="toggle-copy">
        <span className="field-label">{label}</span>
        <strong>{value}</strong>
      </span>
    </button>
  );
}

export function PopupApp() {
  const [settings, setSettings] = useState<ExtensionSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const copy = popupCopy[settings.systemLanguage];

  useEffect(() => {
    void getSettings().then(setSettings);
  }, []);

  async function persist(nextSettings: ExtensionSettings) {
    setSettings(nextSettings);
    await saveSettings(nextSettings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }

  function update<K extends keyof ExtensionSettings>(
    key: K,
    value: ExtensionSettings[K]
  ) {
    void persist({
      ...settings,
      [key]: value
    });
  }

  return (
    <main className="popup-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />

      <section className="hero-panel fade-card">
        <div>
          <p className="eyebrow">{copy.brand}</p>
          <h1>{copy.title}</h1>
          <p className="subtitle">{copy.subtitle}</p>
        </div>
        <div className="saved-pill">{saved ? copy.saved : "\u00a0"}</div>
      </section>

      <section className="bento-grid">
        <Field className="span-2 fade-card delay-1" label={copy.systemLanguage}>
          <Select
            value={settings.systemLanguage}
            onChange={(event) =>
              update("systemLanguage", event.target.value as SystemLanguage)
            }
          >
            {systemLanguageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <ToggleCard
          active={settings.enabled}
          className="fade-card delay-2"
          icon={String.fromCodePoint(0x1f310)}
          label={copy.translation}
          value={settings.enabled ? copy.on : copy.off}
          onClick={() => update("enabled", !settings.enabled)}
        />

        <ToggleCard
          active={settings.translationMode === "auto"}
          className="fade-card delay-3"
          icon={String.fromCodePoint(0x26a1)}
          label={copy.mode}
          value={settings.translationMode === "manual" ? copy.manual : copy.auto}
          onClick={() =>
            update(
              "translationMode",
              settings.translationMode === "manual" ? "auto" : "manual"
            )
          }
        />

        <Field className="fade-card delay-4" label={copy.sourceLanguage}>
          <Select
            value={settings.sourceLanguage}
            onChange={(event) => update("sourceLanguage", event.target.value)}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field className="fade-card delay-5" label={copy.targetLanguage}>
          <Select
            value={settings.targetLanguage}
            onChange={(event) => update("targetLanguage", event.target.value)}
          >
            {languageOptions
              .filter((option) => option.value !== "auto")
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Select>
        </Field>

        <Field className="span-2 fade-card delay-6" label={copy.translationEngine}>
          <Select
            value={settings.engine}
            onChange={(event) =>
              update("engine", event.target.value as TranslationEngine)
            }
          >
            {engineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field className="span-2 fade-card delay-7" label={copy.model}>
          <Input
            value={settings.model}
            onChange={(event) => update("model", event.target.value)}
            placeholder={copy.modelPlaceholder}
          />
        </Field>

        <Field className="span-2 fade-card delay-8" label={copy.apiKey}>
          <Input
            type="password"
            value={settings.apiKey}
            onChange={(event) => update("apiKey", event.target.value)}
            placeholder={copy.enterApiKey}
          />
        </Field>

        <Field className="span-2 fade-card delay-9" label={copy.customApiBaseUrl}>
          <Input
            value={settings.apiBaseUrl}
            onChange={(event) => update("apiBaseUrl", event.target.value)}
            placeholder={copy.optionalCustomEndpoint}
          />
        </Field>

        <Field className="span-2 fade-card delay-10" label={copy.writingShortcutLabel}>
          <Input
            value={settings.writingShortcut}
            onChange={(event) => update("writingShortcut", event.target.value)}
            placeholder={copy.shortcutPlaceholder}
          />
        </Field>

        <ToggleCard
          active={settings.writingTranslationEnabled}
          className="fade-card delay-11"
          icon={String.fromCodePoint(0x270d)}
          label={copy.writing}
          value={settings.writingTranslationEnabled ? copy.on : copy.off}
          onClick={() =>
            update("writingTranslationEnabled", !settings.writingTranslationEnabled)
          }
        />

        <ToggleCard
          active={settings.showBilingual}
          className="fade-card delay-12"
          icon={String.fromCodePoint(0x1f4ac)}
          label={copy.bilingual}
          value={settings.showBilingual ? copy.on : copy.off}
          onClick={() => update("showBilingual", !settings.showBilingual)}
        />

        <ToggleCard
          active={settings.autoTranslateVisibleOnly}
          className="fade-card delay-13"
          icon={String.fromCodePoint(0x1f441)}
          label={copy.visibleOnly}
          value={settings.autoTranslateVisibleOnly ? copy.on : copy.off}
          onClick={() =>
            update("autoTranslateVisibleOnly", !settings.autoTranslateVisibleOnly)
          }
        />

        <ToggleCard
          active={settings.aiMode}
          className="fade-card delay-14"
          icon={String.fromCodePoint(0x2728)}
          label={copy.aiMode}
          value={settings.aiMode ? copy.on : copy.off}
          onClick={() => update("aiMode", !settings.aiMode)}
        />

        <Field className="span-2 fade-card delay-15" label={copy.maxConcurrentJobs}>
          <Input
            type="number"
            min={1}
            max={5}
            value={settings.maxConcurrentJobs}
            onChange={(event) =>
              update("maxConcurrentJobs", Number(event.target.value) || 1)
            }
          />
        </Field>

        <section className="support-card span-2 fade-card delay-16">
          <div>
            <span className="field-label">{copy.supportTitle}</span>
            <strong>ETF：0x8181631e82dc9727b9f91f9ddf11b9561919c43e</strong>
          </div>
          <a
            className="follow-button"
            href="https://x.com/Sea_0f_clouds"
            target="_blank"
            rel="noreferrer"
          >
            {copy.follow} @Sea_0f_clouds
          </a>
        </section>
      </section>
    </main>
  );
}
