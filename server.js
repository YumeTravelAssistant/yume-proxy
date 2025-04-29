import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Carica .env
dotenv.config();

// Sistema per __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inizializza Express
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint POST per ricevere domande
app.post("/api/proxy", async (req, res) => {
  try {
    const { clienteId, domanda } = req.body;

    if (!clienteId || !domanda) {
      return res.status(400).json({ errore: "Dati mancanti: clienteId o domanda" });
    }

    // Chiamata a Azure OpenAI
    const response = await fetch("https://yuta-openai.openai.azure.com/openai/deployments/yuta-gpt4o/chat/completions?api-version=2024-04-01-preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_OPENAI_API_KEY
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Sei un assistente di viaggio esperto del Giappone, aiutami a rispondere." },
          { role: "user", content: domanda }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ errore: "Risposta non valida da Azure OpenAI" });
    }

    const aiReply = data.choices[0].message.content.trim();

    return res.status(200).json({ risposta: aiReply });

  } catch (error) {
    console.error("Errore durante la richiesta a Azure OpenAI:", error.message || error);
    return res.status(500).json({ errore: "Errore interno proxy", dettagli: error.message || error.toString() });
  }
});

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server YUTA avviato su http://localhost:${PORT}`);
});

