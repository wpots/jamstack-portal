import fetch from "node-fetch";

export async function handler(event, context, callback) {
  const url = `https://script.google.com/macros/s/AKfycbxdQ6kyEb-Zf2eeYC8RT7cmLRol8FMGx1IKzCCbJQ35ZFRkUfoKctYk-Zj59zjQg3Ei3A/exec`;

  const payload = event.body;
  let options;

  if (payload) {
    const queryString = new URLSearchParams(JSON.parse(payload));
    options = {
      method: "POST",
      body: queryString,
    };
  } else {
    options = {
      headers: { "Cache-Control": "public, s-maxage=240" },
    };
  }

  try {
    return await fetch(url, { ...options })
      .then(async res => await res.json())
      .then(async data => {
        const body = JSON.stringify(data.ratings);
        return {
          statusCode: 200,
          body,
        };
      });
  } catch (error) {
    callback(null, {
      statusCode: 500,
      body: error,
    });
  }
}
