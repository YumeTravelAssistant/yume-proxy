import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// URL del Web App GAS
const YUMESITE_GAS_URL = "https://script.google.com/macros/s/AKfycbz2hVaNUSMzNzpgQjghkCk3Ov21G0Kuo_z6qq3j_3cRHLt6uFGpzp-bGzlOFdp4Wdwn/exec";

app.post("/api/proxy", async (req, res) => {
  const { clienteId, domanda } = req.body;

  console.log("\x1b[36m%s\x1b[0m", "👉 Dati ricevuti:", { clienteId, domanda });

  try {
    const risposta = await fetch(YUMESITE_GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId,
        domanda
      })
    });

    const text = await risposta.text();
    console.log("\x1b[33m%s\x1b[0m", "👉 Risposta grezza da GAS:", text);

    const json = JSON.parse(text);
    console.log("\x1b[32m%s\x1b[0m", "👉 JSON parsato:", json);

    res.json({ risposta: json.risposta });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "❌ Errore dal server:", error);
    res.status(500).json({ errore: "Errore nel recupero risposta da Yumesite.gs" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server YUTA attivo su http://localhost:${PORT}`);
});

