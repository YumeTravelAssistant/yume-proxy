const fetch = require('node-fetch');

module.exports = async function (context, req) {
  try {
    const dati = req.body;

    const GAS_URL = "https://script.google.com/macros/s/AKfycbxSxeFqQc36ZHAXF-ktSL8KFpb74QVZ4jqHesr25sq2XvE8TxQXRY7n93jJCnBo7IdI/exec";

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
      body: parsed
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: "Errore interno nel proxy", details: error.message }
    };
  }
};

