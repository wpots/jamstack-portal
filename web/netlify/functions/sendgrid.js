import fetch from 'node-fetch';
import sgMail from '@sendgrid/mail';

const getEmailToFromCms = async (formId) => {
  return await fetch(`${process.env.URL}/.netlify/functions/contentful`, {
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
        id: formId,
      },
    }),
  })
    .then((response) => response?.json())
    .then(({ data }) => {
      return data?.form?.forwardEmail;
    });
};

export async function handler(event, context, callback) {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  let payload;

  try {
    payload = JSON.parse(event.body);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } catch (error) {
    return {
      statusCode: 418,
      body: JSON.stringify(error),
    };
  }
  if (!payload) {
    return {
      statusCode: 418,
      body: 'Cannot resolve payload',
    };
  } else {
    // get To Email from CMS
    let sendToEmail;
    let msg;
    try {
      sendToEmail = await getEmailToFromCms(payload.formId);

      msg = {
        to: sendToEmail || 'website@goedgebekt.com',
        from: 'website@goedgebekt.com', // must be verified sender in sendgrid
        subject: `Contactformulier Goedgebekt.com: ${payload.subject}`,
        text: payload.naam + ' : ' + payload.message + 'from: ' + payload.email,
        html: `<p><b>Name: </b>${payload.naam}</p>
                        <p><b>Email: </b>${payload.email}</p>
                        <p><b>Message: </b>${payload.message}</p>
                        <p><b>Sent to: </b>${sendToEmail}</p>`,
      };
    } catch (error) {
      return {
        statusCode: 418,
        body: JSON.stringify(error),
      };
    }

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
        console.error('SENDGRID ERROR');
        return {
          statusCode: 418,
          body: JSON.stringify(error),
        };
      });
    return callback(null, {
      statusCode: 200,
      body: 'hoogah hoogah',
    });
  }
}
