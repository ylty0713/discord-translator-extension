export async function translateWithDeepSeek(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string,
  model: string
): Promise<string> {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Translate Discord messages naturally. Keep tone and formatting. Return only translated text."
        },
        {
          role: "user",
          content: `Translate from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
