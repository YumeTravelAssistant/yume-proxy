module.exports = async function (context, req) {
  try {
    const datiRicevuti = req.body;

    if (!datiRicevuti || typeof datiRicevuti !== 'object') {
      context.res = {
        status: 400,
        body: { status: "error", message: "Nessun dato ricevuto o formato errato" }
      };
      return;
    }

    // Puoi eventualmente loggare qui se vuoi controllare nel monitor di Azure:
    context.log("Dati ricevuti:", JSON.stringify(datiRicevuti, null, 2));

    // ✅ Simula una risposta con codice cliente
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "success",
        codice: "cliente-temporaneo"
      }
    };
  } catch (error) {
    context.log("Errore nella funzione invio-api:", error);

    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "error",
        message: error.message || "Errore interno"
      }
    };
  }
};

