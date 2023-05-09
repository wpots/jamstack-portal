import fetch from "node-fetch";

export async function handler(event, context, callback) {
  const url = `https://script.google.com/macros/s/AKfycbwikG7nA5WBZBc1HobypblNnFBoEQy_q70c7iGdVCIULf85IRTFtb2HdwnSqzNvF8-QZg/exec`;

  const payload = JSON.parse(event.body);
  const queryString = new URLSearchParams(payload);

  try {
    return await fetch(url, {
      method: "POST",
      body: queryString,
    }).then(data => {
      return {
        statusCode: data.status,
        body: data.statusText,
      };
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(event.body),
    };
  }
}
