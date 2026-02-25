export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const apiKey = process.env.REACT_APP_ANTHROPIC_KEY;
  if (!apiKey) return res.status(500).json({ error: "Clé API manquante" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ ...req.body, max_tokens: 4000 }),
    });
    const data = await response.json();
    
    // Extraire le texte brut
    const text = data.content?.map((b) => b.text || "").join("") || "";
    
    // Nettoyer et parser côté serveur
    let parsed = null;
    try {
      let clean = text.trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsed = JSON.parse(clean);
    } catch {
      try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      } catch {}
    }

    // Renvoyer soit le JSON parsé soit le texte brut
    if (parsed) {
      res.status(200).json({ parsed });
    } else {
      res.status(200).json({ raw: text });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}