const fetch = require('node-fetch');

module.exports = async function (context, req) {
  try {
    const dati = req.body;

    const GAS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=...&lib=...";

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dati),
    });

    const result = await response.text(); // <-- .text() per evitare crash su non-JSON

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { status: "raw", response: result };
    }

    context.res = {
      status: 200,
      body: parsed
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: "Errore interno nel proxy", details: error.message }
    };
  }
};

