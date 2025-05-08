const fetch = require('node-fetch');

module.exports = async function (context, req) {
const datiRicevuti = req.body || {};
const { clienteId, domanda } = datiRicevuti;

if (!clienteId || !domanda) {
  context.res = {
    status: 400,
    body: { errore: "Parametri mancanti: clienteId o domanda." }
  };
  return;
}

  const GAS_URL = "https://script.google.com/macros/s/AKfycbz2hVaNUSMzNzpgQjghkCk3Ov21G0Kuo_z6qq3j_3cRHLt6uFGpzp-bGzlOFdp4Wdwn/exec";

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datiRicevuti)
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
};

