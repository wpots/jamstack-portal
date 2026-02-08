type NetlifyEvent = {
  body?: string | null;
};

type NetlifyResponse = {
  statusCode: number;
  body: string;
};

type SubmissionData = Record<string, string>;

const getEmailToFromCms = async (formId?: string): Promise<string | null> => {
  if (!formId) {
    return null;
  }

  return await fetch(`${process.env.URL}/.netlify/functions/content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    .then((payload: unknown) => {
      const typedPayload = payload as { data?: { form?: { forwardEmail?: string } } };
      return typedPayload?.data?.form?.forwardEmail ?? null;
    });
};

const getSubmissionData = (event: NetlifyEvent): SubmissionData => {
  if (!event?.body) {
    return {};
  }

  try {
    const parsedBody = JSON.parse(event.body) as {
      payload?: { data?: SubmissionData; form_data?: SubmissionData; fields?: SubmissionData };
      data?: SubmissionData;
      form_data?: SubmissionData;
      fields?: SubmissionData;
    };
    const payload = parsedBody?.payload ?? parsedBody ?? {};
    return payload?.data ?? payload?.form_data ?? payload?.fields ?? {};
  } catch (error) {
    console.error("Failed to parse submission payload", error);
    return {};
  }
};

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (!process.env.RESEND_API_KEY) {
    return {
      statusCode: 500,
      body: "Missing RESEND_API_KEY",
    };
  }

  const { Resend } = await import("resend");
  const submission = getSubmissionData(event);
  const sendToEmail = await getEmailToFromCms(submission["form-id"]);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const messageText = [
    `Name: ${submission.naam || ""}`,
    `Email: ${submission.email || ""}`,
    `Subject: ${submission.subject || ""}`,
    `Message: ${submission.message || ""}`,
    `Sent to: ${sendToEmail || "website@goedgebekt.com"}`,
  ].join("\n");

  try {
    const data = await resend.emails.send({
      to: sendToEmail || "website@goedgebekt.com",
      from: "website@goedgebekt.com",
      reply_to: submission.email || undefined,
      subject: `Contactformulier Goedgebekt.com: ${
        submission.subject || "(no subject)"
      }`,
      text: messageText,
      html: `<p><b>Name: </b>${submission.naam || ""}</p>
<p><b>Email: </b>${submission.email || ""}</p>
<p><b>Message: </b>${submission.message || ""}</p>
<p><b>Sent to: </b>${sendToEmail || "website@goedgebekt.com"}</p>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Resend error", error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
}
