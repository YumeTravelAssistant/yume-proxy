const fetch = require('node-fetch');

module.exports = async function (context, req) {
  const body = req.body || {};
  const GAS_URL = "https://script.google.com/macros/s/AKfycbz2hVaNUSMzNzpgQjghkCk3Ov21G0Kuo_z6qq3j_3cRHLt6uFGpzp-bGzlOFdp4Wdwn/exec";

  // 🔹 CASO 1 — richiesta YUTA con clienteId e domanda
  if (body.clienteId && body.domanda) {
    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: body.clienteId,
          domanda: body.domanda
        })
      });

      const data = await response.json();

      context.res = {
        status: 200,
        body: data
      };
    } catch (error) {
      context.res = {
        status: 500,
        body: { errore: "Errore nella comunicazione con GAS", dettaglio: error.message }
      };
    }
    return;
  }

  // 🔸 CASO 2 — richiesta profilo completo da riepilogo.html
  if (body.nome && body.email && body.nazionalita) {
    try {
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body) // invia tutto il profilo e approfondimenti
      });

      const data = await response.json();

      context.res = {
        status: 200,
        body: data
      };
    } catch (error) {
      context.res = {
        status: 500,
        body: { errore: "Errore durante l'invio del profilo", dettaglio: error.message }
      };
    }
    return;
  }

  // ❌ Se non rientra in nessuno dei due casi
  context.res = {
    status: 400,
    body: { errore: "Parametri non validi per proxy." }
  };
};

