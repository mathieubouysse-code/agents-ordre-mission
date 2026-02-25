export async function callAgent(systemPrompt, userMessage) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Erreur : ${response.status}`);
  }

  const data = await response.json();
  
  // Le serveur renvoie soit { parsed: {...} } soit { raw: "..." }
  if (data.parsed) return data.parsed;
  return { raw: data.raw || JSON.stringify(data) };
}