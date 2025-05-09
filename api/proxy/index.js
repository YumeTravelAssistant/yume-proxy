
module.exports = async function (context, req) {
  let datiRicevuti = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");

  // Estrai tutti i dati attesi
  const {
    clienteId,
    domanda,
    meteo,
    previsioniGiorni,
    oraLocale
  } = datiRicevuti;

  // ✅ LOG DI DEBUG
  console.log("📩 Dati ricevuti dal frontend:", datiRicevuti);
  console.log("🛰️ METEO:", meteo);
  console.log("🛰️ PREVISIONI:", previsioniGiorni);
  console.log("🕒 ORA LOCALE:", oraLocale);

  // ❌ Se mancano clienteId o domanda
  if (!clienteId || !domanda) {
    context.res = {
      status: 400,
      body: { errore: "Parametri mancanti: clienteId o domanda." }
    };
    return;
  }

  // ❌ Se meteo o previsioni non sono corretti
  if (typeof meteo !== "string" || !Array.isArray(previsioniGiorni)) {
    context.res = {
      status: 400,
      body: {
        errore: "Dati meteo o previsioniGiorni mancanti o in formato errato.",
        debug: {
          tipoMeteo: typeof meteo,
          tipoPrevisioni: Object.prototype.toString.call(previsioniGiorni)
        }
      }
    };
    return;
  }

  // ✅ URL del tuo GAS
  const GAS_URL = "https://script.google.com/macros/s/AKfycbz2hVaNUSMzNzpgQjghkCk3Ov21G0Kuo_z6qq3j_3cRHLt6uFGpzp-bGzlOFdp4Wdwn/exec";

  // ✅ Invia tutto a GAS
  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId,
        domanda,
        meteo,
        previsioniGiorni,
        oraLocale
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
};

