import { adminDatabase } from './_shared/firebase-admin';
import {
  assertAllowedOrigin,
  createJsonResponse,
  enforceRateLimit,
  ensureGetRequest,
  getClientIp,
  mapApiError,
} from './_shared/feedback';

type NetlifyEvent = {
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
};

type FeedbackRecord = {
  date?: number | string;
  naam?: string | null;
  tiptop?: string;
  updatedAt?: string;
};

type FeedbackListItem = {
  id: string;
  tiptop: string;
  naam?: string;
  date?: number;
  updatedAt?: string;
};

function mapFeedbackSnapshot(value: Record<string, FeedbackRecord>): FeedbackListItem[] {
  const feedback: FeedbackListItem[] = [];

  for (const feedbackId in value) {
    const entry = value[feedbackId];
    const message = entry?.tiptop?.trim();

    if (!message) {
      continue;
    }

    const date =
      typeof entry.date === 'number'
        ? entry.date
        : typeof entry.date === 'string' && entry.date.trim()
          ? Number(entry.date)
          : undefined;
    const normalizedDate = typeof date === 'number' && Number.isFinite(date) ? date : undefined;

    feedback.push({
      id: feedbackId,
      tiptop: message,
      naam: entry.naam ?? undefined,
      date: normalizedDate,
      updatedAt: entry.updatedAt,
    });
  }

  return feedback.sort((left, right) => (right.date || 0) - (left.date || 0));
}

export async function handler(event: NetlifyEvent) {
  try {
    ensureGetRequest(event);
    assertAllowedOrigin(event);

    const clientIp = getClientIp(event);
    enforceRateLimit(`list-feedback:${clientIp}`, 60, 5 * 60 * 1000);

    const snapshot = await adminDatabase.ref('feedback').get();
    const value = snapshot.val() as Record<string, FeedbackRecord> | null;
    const feedback = value ? mapFeedbackSnapshot(value) : [];

    return createJsonResponse(200, {
      feedback,
      ok: true,
    });
  } catch (error) {
    console.error('list-feedback', error);
    return mapApiError(error);
  }
}
