export default async function handler(req, res) {
  const allowedOrigins = [
    "https://melodious-malabi-90a97a.netlify.app",
    "https://adorable-paletas-a55d09.netlify.app"
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ errore: "Metodo non consentito" });
  }

  const { clienteId, domanda } = req.body;

  if (!clienteId || !domanda) {
    return res.status(400).json({ errore: "Dati mancanti: clienteId o domanda" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const gasResponse = await fetch("https://script.google.com/macros/s/AKfycbz2hVaNUSMzNzpgQjghkCk3Ov21G0Kuo_z6qq3j_3cRHLt6uFGpzp-bGzlOFdp4Wdwn/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, domanda }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const text = await gasResponse.text();
    const data = JSON.parse(text);

    // Se GAS risponde bene
    if (data && !data.errore) {
      return res.status(200).json(data);
    }

    console.warn("⚠️ Risposta anomala da GAS, provo fallback su Azure OpenAI...");

    // Se la risposta di GAS non va bene, usa Azure OpenAI
    const azureData = await callAzureOpenAI(domanda);
    return res.status(200).json({ risposta: azureData.choices[0].message.content });

  } catch (error) {
    console.error("❌ Errore durante la richiesta:", error.message || error);
    res.status(500).json({ errore: "Errore interno proxy", dettagli: error.message || error.toString() });
  }
}

// Funzione per chiamare Azure OpenAI GPT-4o
async function callAzureOpenAI(userMessage) {
  const endpoint = "https://yuta-openai.openai.azure.com/openai/deployments/yuta-gpt4o/chat/completions?api-version=2024-04-01-preview";
  const apiKey = process.env.AZURE_OPENAI_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "api-key": apiKey
  };

  const payload = {
    messages: [
      { role: "system", content: "Sei un assistente esperto di viaggi in Giappone." },
      { role: "user", content: userMessage }
    ],
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 800
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data;
}

