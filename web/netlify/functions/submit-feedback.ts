import { adminDatabase } from './_shared/firebase-admin';
import {
  assertAllowedOrigin,
  createJsonResponse,
  enforceRateLimit,
  ensurePostRequest,
  getClientIp,
  mapApiError,
  parseJsonBody,
  sanitizeMessage,
  sanitizeOptionalName,
} from './_shared/feedback';

type NetlifyEvent = {
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
};

type SubmitFeedbackPayload = {
  naam?: string | null;
  tiptop?: string | null;
  website?: string | null;
};

export async function handler(event: NetlifyEvent) {
  try {
    ensurePostRequest(event);
    assertAllowedOrigin(event);

    const payload = parseJsonBody<SubmitFeedbackPayload>(event);
    const honeypotValue = payload.website?.trim();

    if (honeypotValue) {
      throw new Error('HONEYPOT_TRIGGERED');
    }

    const clientIp = getClientIp(event);
    const naam = sanitizeOptionalName(payload.naam);
    const tiptop = sanitizeMessage(payload.tiptop);

    enforceRateLimit(`feedback:${clientIp}`, 5, 15 * 60 * 1000);

    const entryRef = adminDatabase.ref('feedback').push();

    await entryRef.set({
      date: Date.now(),
      naam,
      tiptop,
      updatedAt: new Date().toISOString(),
    });

    return createJsonResponse(200, {
      id: entryRef.key,
      ok: true,
    });
  } catch (error) {
    console.error('submit-feedback', error);
    return mapApiError(error);
  }
}
