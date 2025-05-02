const fetch = require('node-fetch');

module.exports = async function (context, req) {
  // ✅ 1. Gestione della preflight CORS (OPTIONS)
  if (req.method === "OPTIONS") {
    context.res = {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://yuta-travel.com",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: null
    };
    return;
  }

  try {
    if (!req.body) throw new Error("Corpo della richiesta assente.");

    const dati = req.body;
    const path = req.url || req.originalUrl || "";

    // 🔗 URL del relay.gs
    const GAS_URL = "https://script.google.com/macros/s/AKfycbwd351JhRTUmtNtnvquM0dD435qwmwnmE4GK6jtEMKnUe7Ospt-mZiu8X7d2ARvB3hlMg/exec";
    // 🧠 Routing dinamico solo se tipoRichiesta non presente
    if (!dati.tipoRichiesta) {
      if (path.includes("/verify-login")) {
        dati.tipoRichiesta = "login";
      } else if (path.includes("/get-cliente")) {
        dati.tipoRichiesta = "get";
      } else if (path.includes("/update-cliente")) {
        dati.tipoRichiesta = "update";
      } else {
        dati.tipoRichiesta = "profilo";
      }
    }

    // 🔄 Invia al relay GAS
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dati),
    });

    let parsed;
    let resultText;

    try {
      parsed = await response.json();
    } catch {
      resultText = await response.text();
      try {
        parsed = JSON.parse(resultText);
      } catch {
        parsed = { status: "raw", response: resultText };
      }
    }

    context.res = {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://yuta-travel.com",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: parsed
    };

  } catch (error) {
    context.res = {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://yuta-travel.com",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: {
        error: "Errore interno nel proxy",
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    };
  }
};

