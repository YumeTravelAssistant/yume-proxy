
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

// ❗ Converti forzatamente i valori per evitare crash
const meteoFinale = typeof meteo === "string" ? meteo : "";
const previsioniFinali = Array.isArray(previsioniGiorni) ? previsioniGiorni : [];

console.log("📦 METEO:", meteoFinale);
console.log("📦 PREVISIONI:", previsioniFinali);
console.log("📦 ORA LOCALE:", oraLocale);

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
       meteo: meteoFinale,
       previsioniGiorni: previsioniFinali,
       oraLocale
})
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

