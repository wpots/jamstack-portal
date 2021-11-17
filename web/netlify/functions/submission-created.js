import fetch from 'node-fetch';
import sgMail from '@sendgrid/mail';
export async function handler(event, context, callback) {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const data = JSON.parse(event.body).payload.data;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const sendTo = await fetch(`${process.env.URL}/.netlify/functions/contentful`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query getAsset($id: String!) {
          form(id: $id) {
            forwardEmail
          }
        }
      `,
      variables: {
        id: data.formId,
      },
    }),
  })
    .then((response) => response.json())
    .then(({ data }) => {
      return data;
    });
  const msg = {
    to: 'website@goedgebekt.com',
    from: 'wieteke@pettico.de', // must be verified sender in sendgrid
    subject: `Contactformulier Goedgebekt.com: ${data.subject}`,
    text: data.naam + ' : ' + data.message + 'from: ' + data.email,
    html: `<p><b>Name: </b>${data.naam}</p>
                        <p><b>Email: </b>${data.email}</p>
                        <p><b>Message: </b>${data.message}</p>
                        <p><b>Sent to: </b>${sendTo.form.forwardEmail}</p>`,
  };
  sgMail
    .send(msg)
    .then((data) => {
      console.log('SENDGRID SUCCESS');
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch((error) => {
      console.error('SENDGRID ERROR');
      return callback(null, {
        statusCode: 418,
        body: JSON.stringify(error),
      });
    });
  return callback(null, {
    statusCode: 200,
    body: 'hoogah hoogah',
  });
}
