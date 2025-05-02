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
    const dati = req.body || {};
    const path = req.url || req.originalUrl || "";

    // 🔗 URL del tuo relay.gs (rimane invariato)
    const GAS_URL = "https://script.google.com/macros/s/AKfycbwd351JhRTUmtNtnvquM0dD435qwmwnmE4GK6jtEMKnUe7Ospt-mZiu8X7d2ARvB3hlMg/exec";

    // 🔁 Routing automatico in base al path, solo se non già presente
    if (!dati.tipoRichiesta) {
      if (path.includes("/verify-login")) {
        dati.tipoRichiesta = "login";
      } else if (path.includes("/get-cliente")) {
        dati.tipoRichiesta = "get";
      } else if (path.includes("/update-cliente")) {
        dati.tipoRichiesta = "update";
      } else {
        dati.tipoRichiesta = "profilo"; // default fallback per riepilogo.html
      }
    }

    // 🔄 Invio al relay GAS
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dati),
    });

let parsed;
try {
  parsed = await response.json(); // ✅ prova a leggere direttamente come JSON
} catch {
  const resultText = await response.text(); // fallback in caso di errore
  parsed = { status: "raw", response: resultText };
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
        details: error.message
      }
    };
  }
};

