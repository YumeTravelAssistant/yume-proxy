const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    const body = req.body || {};

    if (!body.nome || !body.email || !body.nazionalita) {
      context.res = {
        status: 400,
        body: {
          status: "error",
          message: "Campi obbligatori mancanti (nome, email, nazionalità)"
        }
      };
      return;
    }

    // Chiamata al tuo Google Apps Script
    const responseGAS = await fetch("https://script.google.com/macros/s/AKfycbwNSo8z_0LIXi8jEJrgPhdxI239Skv0PqbovYXL2eRsQ6i88PvHUxFxlRxINIEHXeLB/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await responseGAS.json();

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "success",
        codice: result.codice || "non specificato"
      }
    };

  } catch (error) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "error",
        message: "Errore durante l'invio al GAS",
        dettaglio: error.message
      }
    };
  }
};

