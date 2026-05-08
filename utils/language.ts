export const languageOptions = [
  { label: "Auto Detect", value: "auto" },
  { label: "Chinese", value: "zh-CN" },
  { label: "English", value: "en" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" }
];

export function normalizeLanguage(language: string): string {
  return language === "auto" ? "auto" : language;
}
