import { adminDatabase } from './_shared/firebase-admin';
import {
  assertAllowedOrigin,
  createJsonResponse,
  enforceRateLimit,
  ensurePostRequest,
  getClientIp,
  mapApiError,
  parseJsonBody,
  validateParticipantId,
  validatePerformedByUs,
  validateRating,
  validateSongId,
} from './_shared/feedback';

type NetlifyEvent = {
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
};

type SubmitRatingPayload = {
  songId?: string;
  rating?: number;
  participantId?: string;
  performedByUs?: boolean;
};

export async function handler(event: NetlifyEvent) {
  try {
    ensurePostRequest(event);
    assertAllowedOrigin(event);

    const payload = parseJsonBody<SubmitRatingPayload>(event);
    const songId = validateSongId(payload.songId);
    const rating = validateRating(payload.rating);
    const participantId = validateParticipantId(payload.participantId);
    const performedByUs = validatePerformedByUs(payload.performedByUs);
    const clientIp = getClientIp(event);

    enforceRateLimit(`rating:${clientIp}`, 60, 5 * 60 * 1000);
    enforceRateLimit(`rating:${clientIp}:${songId}`, 10, 5 * 60 * 1000);

    await adminDatabase.ref(`songRatings/${songId}/${participantId}`).set({
      id: Date.now(),
      participantId,
      rating,
      performedByUs,
      updatedAt: new Date().toISOString(),
    });

    return createJsonResponse(200, {
      key: participantId,
      ok: true,
    });
  } catch (error) {
    console.error('submit-rating', error);
    return mapApiError(error);
  }
}
