import fetch from 'node-fetch';
import sgMail from '@sendgrid/mail';
import formQuery from '../../src/apollo/queries/formQuery.graphql';
export async function handler(event, context) {
  console.log('{NETLIFY}', event);
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const data = JSON.parse(event.body).payload.data;
  console.log(`Received a submission:`, data);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const sendTo = await fetch('/.netlify/functions/contentful', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: formQuery,
      variables: {
        formId: data.formId,
      },
    }),
  });

  const msg = {
    to: 'website@goedgebekt.com', // Change to your recipient
    from: 'website@goedgebekt.com', // Change to your verified sender
    subject: `Contactformulier Goedgebekt.com: ${data.subject}`,
    text: data.naam + ' : ' + data.message + 'from: ' + data.email,
    html: `<p><b>Name: </b>${data.naam}</p>
                        <p><b>Email: </b>${data.email}</p>
                        <p><b>Message: </b>${data.message}</p>`,
  };
  sgMail
    .send(msg)
    .then((data) => {
      console.log('SENDGRID SUCCESS');
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    })
    .catch((error) => {
      console.error('SENDGRID ERROR', error);
      return { statusCode: 418, body: JSON.stringify(error) };
    });
  return { statusCode: 200 };
}
