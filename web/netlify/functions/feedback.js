import fetch from "node-fetch";

export async function handler(event, context, callback) {
  let payload;
  const url = `https://script.google.com/macros/s/AKfycbz3a8NpeBbycJpjLNsldGsGwhVz8wB8oPZjBJVobKmh_iXsN3yj0jSxctVlqcEdcEQ3uA/exec`;
  try {
    return await fetch(url, {
      method: "POST",
      body: event.body,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
}
