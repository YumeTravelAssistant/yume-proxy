const fetch = require('node-fetch');

module.exports = async function (context, req) {
  try {
    const dati = req.body;

    const GAS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhJ74sAm8HgI-6_fTF0fAvMU4brP_LGA3TDcyBg0ao1wM0sdZxqd7nsc9VaMGvI5bzC7nDprWqgu771teJgn4cTLH3S7ooSyWbMW5JqjRf740vaFFIsmH8m1wZ_69Ian6Bu0-LVhKDk3BZvVb4msG0jvIce2iteWu0-TFnigMvzhayb2nF1f10d6-BqslHOHmQSPESS3_QAoooOQbg3_2zowDSVMsNTzNCBGnij9FhBYZn-D94j8jwnSJK6n7G0yMpuO3yoZLpGEb-mnzyZi3ZDS0V-Tw&lib=MyI-40eICbgeDC81bwfI9yfc7DDi5YgSz";

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dati),
    });

    const result = await response.text(); // <-- .text() per evitare crash su non-JSON

    // Prova a convertire in JSON
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { status: "raw", response: result };
    }

    context.res = {
      status: 200,
      body: parsed
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: "Errore interno nel proxy", details: error.message }
    };
  }
};

