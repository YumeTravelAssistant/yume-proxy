module.exports = async function (context, req) {
  let datiRicevuti;

  try {
    datiRicevuti = typeof req.body === "object"
      ? req.body
      : JSON.parse(req.body || "{}");
  } catch (e) {
    context.res = {
      status: 400,
      body: {
        errore: "❌ Errore nel parsing del JSON in req.body.",
        dettaglio: e.message,
        raw: req.body
      }
    };
    return;
  }

const clienteId = datiRicevuti.clienteId || "";
const domanda = datiRicevuti.domanda || "";
const meteo = typeof datiRicevuti.meteo === "string" ? datiRicevuti.meteo : "";
const previsioniGiorni = Array.isArray(datiRicevuti.previsioniGiorni) ? datiRicevuti.previsioniGiorni : [];
const oraLocale = typeof datiRicevuti.oraLocale === "string" ? datiRicevuti.oraLocale : "";

console.log("📦 Dati estratti:");
console.log("clienteId:", clienteId);
console.log("domanda:", domanda);
console.log("meteo:", meteo);
console.log("previsioniGiorni:", previsioniGiorni);
console.log("oraLocale:", oraLocale);

  console.log("📩 Dati ricevuti dal frontend:", datiRicevuti);
  console.log("✅ Tipo previsioniGiorni:", typeof previsioniGiorni);
  console.log("✅ È array?:", Array.isArray(previsioniGiorni));
  console.log("🛰️ METEO:", meteo);
  console.log("🕒 ORA LOCALE:", oraLocale);

  if (!clienteId || !domanda) {
    context.res = {
      status: 400,
      body: { errore: "Parametri mancanti: clienteId o domanda." }
    };
    return;
  }

if (typeof meteo !== "string" || !Array.isArray(previsioniGiorni)) {
  context.res = {
    status: 400,
    body: {
      errore: "❌ Dati meteo o previsioniGiorni in formato errato.",
      debug: {
        tipoMeteo: typeof meteo,
        tipoPrevisioni: Object.prototype.toString.call(previsioniGiorni),
        valorePrevisioni: previsioniGiorni
      }
    }
  };
  return;
}

  // tutto il resto rimane uguale


  // ✅ URL del tuo GAS
  const GAS_URL = "https://script.google.com/macros/s/AKfycbz2hVaNUSMzNzpgQjghkCk3Ov21G0Kuo_z6qq3j_3cRHLt6uFGpzp-bGzlOFdp4Wdwn/exec";

  // ✅ Invia tutto a GAS
  try {

 // Limita a massimo 2 righe
const previsioniGiorniLimitate = Array.isArray(previsioniGiorni)
  ? previsioniGiorni.slice(0, 2)
  : [];

const payload = {
  clienteId,
  domanda,
  meteo,
  oraLocale
};

console.log("📤 Payload clienteId:", clienteId);
console.log("📤 Payload domanda:", domanda);
console.log("📤 Payload meteo:", meteo);
console.log("📤 Payload oraLocale:", oraLocale);

console.log("📤 Payload inviato a GAS:", JSON.stringify(payload, null, 2));


  const response = await fetch(GAS_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)  // ✅ Questo è quello che hai già limitato a 2 righe
});

const data = await response.json();

context.res = {
  status: 200,
  body: {
    ...data,
    debugPayloadInviato: {
      clienteId,
      domanda,
      meteo,
      previsioniGiorni,
      oraLocale
    }
  }
};



  } catch (error) {
    context.res = {
      status: 500,
      body: { errore: "Errore nella comunicazione con GAS", dettaglio: error.message }
    };
  }
};

