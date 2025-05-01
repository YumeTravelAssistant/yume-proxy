module.exports = async function (context, req) {
  const data = req.body || {};

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwNSo8z_0LIXi8jEJrgPhdxI239Skv0PqbovYXL2eRsQ6i88PvHUxFxlRxINIEHXeLB/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    context.res = {
      status: 200,
      body: result
    };

  } catch (error) {
    context.res = {
      status: 502,
      body: {
        status: "error",
        message: "Errore durante la ricezione della risposta da GAS",
        dettaglio: error.toString()
      }
    };
  }
};

