const fetch = require('node-fetch');

module.exports = async function (context, req) {
  try {
    const dati = req.body;
    const path = req.url || req.originalUrl || "";

    // 🔗 URL del tuo relay.gs
    const GAS_URL = "https://script.google.com/macros/s/AKfycbwd351JhRTUmtNtnvquM0dD435qwmwnmE4GK6jtEMKnUe7Ospt-mZiu8X7d2ARvB3hlMg/exec";

    // 🧠 Imposta tipoRichiesta solo se non è già presente
    if (!dati.tipoRichiesta) {
      if (path.includes("/verify-login")) {
        dati.tipoRichiesta = "login";
      } else if (path.includes("/get-cliente")) {
        dati.tipoRichiesta = "get";
      } else if (path.includes("/update-cliente")) {
        dati.tipoRichiesta = "update";
      } else {
        dati.tipoRichiesta = "profilo"; // fallback default
      }
    }

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dati),
    });

    const result = await response.text();

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { status: "raw", response: result };
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

