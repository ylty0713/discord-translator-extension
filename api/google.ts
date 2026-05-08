interface GoogleResponse {
  sentences?: Array<{ trans?: string }>;
}

export async function translateWithGoogle(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  const params = new URLSearchParams({
    client: "gtx",
    sl: sourceLanguage,
    tl: targetLanguage,
    dt: "t",
    q: text
  });

  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Google Translate request failed with ${response.status}`);
  }

  const data = (await response.json()) as [Array<[string]>] | GoogleResponse;

  if (Array.isArray(data)) {
    return data[0].map((item) => item[0]).join("").trim();
  }

  return data.sentences?.map((sentence) => sentence.trans ?? "").join("").trim() ?? "";
}
