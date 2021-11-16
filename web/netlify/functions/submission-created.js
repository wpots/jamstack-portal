import sgMail from '@sendgrid/mail';
export async function handler(event, context) {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const data = JSON.parse(event.body).payload.data;
  console.log(`Received a submission:`, data);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'website@goedgebekt.com', // Change to your recipient
    from: data.email, // Change to your verified sender
    subject: data.subject,
    text: data.naam + ' : ' + data.message,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
      return {
        statusCode: 200,
      };
    })
    .catch((error) => {
      console.error(error);
      return { statusCode: 418 };
    });
}
