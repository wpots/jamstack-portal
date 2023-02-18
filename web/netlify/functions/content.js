import fetch from 'node-fetch';

export async function handler(event, context) {
  const url = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

  try {
    return await fetch(url, {
      method: 'POST',
      body: event.body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return {
          statusCode: 200,
          body: JSON.stringify(data),
        };
      });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(event.body),
    };
  }
}
