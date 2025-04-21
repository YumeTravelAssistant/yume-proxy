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
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Errore durante la richiesta a GAS:", error.message || error);
    res.status(500).json({ errore: "Errore interno proxy", dettagli: error.message || error.toString() });
  }
}
