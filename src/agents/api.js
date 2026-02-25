export async function callAgent(systemPrompt, userMessage) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_KEY;

  if (!apiKey) {
    throw new Error("Clé API manquante. Ajoutez REACT_APP_ANTHROPIC_KEY dans Vercel.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Erreur API : ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.map((b) => b.text || "").join("") || "";

  try {
    const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, (t) =>
      t.replace(/^```json\n?|^```\n?|```$/g, "")
    ).trim();
    const match = clean.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { raw: text };
  } catch {
    return { raw: text };
  }
}