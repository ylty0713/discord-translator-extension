export async function translateWithOpenAI(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string,
  apiBaseUrl: string,
  model: string
): Promise<string> {
  const endpoint = apiBaseUrl || "https://api.openai.com/v1/chat/completions";
  const response = await fetch(endpoint, {
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
            "You are a Discord translation assistant. Preserve tone, slang, emojis, formatting, and community context. Return only the translated text."
        },
        {
          role: "user",
          content: `Translate the following Discord message from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
