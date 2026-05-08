export async function translateWithClaude(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string,
  model: string
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system:
        "You translate Discord messages naturally while keeping community slang and formatting. Return only translated text.",
      messages: [
        {
          role: "user",
          content: `Translate from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude request failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };

  return data.content?.find((item) => item.type === "text")?.text?.trim() ?? "";
}
