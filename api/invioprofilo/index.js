const fetch = require('node-fetch');

module.exports = async function (context, req) {
  const datiProfilo = req.body;

  const GAS_URL = "https://script.google.com/macros/s/AKfycbwNSo8z_0LIXi8jEJrgPhdxI239Skv0PqbovYXL2eRsQ6i88PvHUxFxlRxINIEHXeLB/exec";

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datiProfilo)
    });

    const data = await response.json();

    context.res = {
      status: 200,
      body: data
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        errore: "Errore durante l'invio al GAS",
        dettaglio: error.message
      }
    };
  }
};

