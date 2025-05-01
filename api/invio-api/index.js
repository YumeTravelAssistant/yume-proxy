const fetch = require('node-fetch');

module.exports = async function (context, req) {
  const datiFinali = req.body || {};

  try {
    const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhJ74sAm8HgI-6_fTF0fAvMU4brP_LGA3TDcyBg0ao1wM0sdZxqd7nsc9VaMGvI5bzC7nDprWqgu771teJgn4cTLH3S7ooSyWbMW5JqjRf740vaFFIsmH8m1wZ_69Ian6Bu0-LVhKDk3BZvVb4msG0jvIce2iteWu0-TFnigMvzhayb2nF1f10d6-BqslHOHmQSPESS3_QAoooOQbg3_2zowDSVMsNTzNCBGnij9FhBYZn-D94j8jwnSJK6n7G0yMpuO3yoZLpGEb-mnzyZi3ZDS0V-Tw&lib=MyI-40eICbgeDC81bwfI9yfc7DDi5YgSz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datiFinali)
    });

    const result = await response.json();

    context.res = {
      status: 200,
      body: {
        status: result.status || "error",
        codice: result.codice || "non specificato",
        risposta: result.risposta || "Risposta non ricevuta dal GAS"
      }
    };

  } catch (error) {
    context.res = {
      status: 500,
      body: { status: "error", message: error.message }
    };
  }
};

