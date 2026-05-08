export async function translateWithLibre(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  apiBaseUrl: string
): Promise<string> {
  const endpoint = apiBaseUrl || "https://libretranslate.com/translate";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: text,
      source: sourceLanguage === "auto" ? "auto" : sourceLanguage,
      target: targetLanguage,
      format: "text"
    })
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate request failed with ${response.status}`);
  }

  const data = (await response.json()) as { translatedText?: string };
  return data.translatedText?.trim() ?? "";
}
