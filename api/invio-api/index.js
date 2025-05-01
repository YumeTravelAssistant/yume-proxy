const fetch = require("node-fetch");

module.exports = async function (context, req) {
  const body = req.body || {};

  const GAS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhJ74sAm8HgI-6_fTF0fAvMU4brP_LGA3TDcyBg0ao1wM0sdZxqd7nsc9VaMGvI5bzC7nDprWqgu771teJgn4cTLH3S7ooSyWbMW5JqjRf740vaFFIsmH8m1wZ_69Ian6Bu0-LVhKDk3BZvVb4msG0jvIce2iteWu0-TFnigMvzhayb2nF1f10d6-BqslHOHmQSPESS3_QAoooOQbg3_2zowDSVMsNTzNCBGnij9FhBYZn-D94j8jwnSJK6n7G0yMpuO3yoZLpGEb-mnzyZi3ZDS0V-Tw&lib=MyI-40eICbgeDC81bwfI9yfc7DDi5YgSz";

  try {
    const responseGAS = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await responseGAS.text();
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      context.log("❌ JSON parsing fallito:", parseError.message);
      context.res = {
        status: 502,
        body: {
          status: "error",
          message: "Errore nel parsing della risposta di GAS",
          debug: text
        }
      };
      return;
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        status: parsed.status || "success",
        codice: parsed.codice || "non specificato",
        debug: parsed
      }
    };
  } catch (error) {
    context.log("❌ Errore fetch verso GAS:", error.message);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "error",
        message: "Errore nella comunicazione con GAS",
        dettaglio: error.message
      }
    };
  }
};

