type NetlifyEvent = {
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

const rateLimitStore = new Map<string, number[]>();

export function createJsonResponse(statusCode: number, body: JsonValue) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

export function ensurePostRequest(event: NetlifyEvent) {
  if (event.httpMethod !== 'POST') {
    throw new Error('METHOD_NOT_ALLOWED');
  }
}

export function ensureGetRequest(event: NetlifyEvent) {
  if (event.httpMethod !== 'GET') {
    throw new Error('METHOD_NOT_ALLOWED');
  }
}

export function parseJsonBody<T>(event: NetlifyEvent): T {
  if (!event.body) {
    throw new Error('EMPTY_BODY');
  }

  try {
    return JSON.parse(event.body) as T;
  } catch {
    throw new Error('INVALID_JSON');
  }
}

function getRequestOrigin(event: NetlifyEvent): string | null {
  const origin = event.headers?.origin || event.headers?.Origin;

  if (origin) {
    return origin;
  }

  const referer = event.headers?.referer || event.headers?.Referer;

  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function isLocalhostOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function isAllowedFeedbackOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (!isLocalhostOrigin(origin)) {
    return false;
  }

  return allowedOrigins.some((allowedOrigin) => isLocalhostOrigin(allowedOrigin));
}

export function assertAllowedOrigin(event: NetlifyEvent) {
  const allowList = process.env.FEEDBACK_ALLOWED_ORIGINS;

  if (!allowList) {
    return;
  }

  const origin = getRequestOrigin(event);

  if (!origin) {
    throw new Error('ORIGIN_REQUIRED');
  }

  const allowedOrigins = allowList
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (!isAllowedFeedbackOrigin(origin, allowedOrigins)) {
    throw new Error('ORIGIN_NOT_ALLOWED');
  }
}

export function getClientIp(event: NetlifyEvent): string {
  const forwardedFor =
    event.headers?.['x-forwarded-for'] ||
    event.headers?.['client-ip'] ||
    event.headers?.['x-nf-client-connection-ip'];

  if (!forwardedFor) {
    return 'unknown';
  }

  return forwardedFor.split(',')[0].trim();
}

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const requests = rateLimitStore.get(key) || [];
  const activeRequests = requests.filter((timestamp) => timestamp > windowStart);

  if (activeRequests.length >= limit) {
    throw new Error('RATE_LIMITED');
  }

  activeRequests.push(now);
  rateLimitStore.set(key, activeRequests);
}

export function sanitizeOptionalName(name?: string | null): string | null {
  const trimmedName = name?.trim() || '';

  if (!trimmedName) {
    return null;
  }

  return trimmedName.slice(0, 80);
}

export function sanitizeMessage(message?: string | null): string {
  const trimmedMessage = message?.trim() || '';

  if (!trimmedMessage) {
    throw new Error('MESSAGE_REQUIRED');
  }

  return trimmedMessage.slice(0, 1000);
}

export function validateParticipantId(participantId?: string | null): string {
  const trimmedParticipantId = participantId?.trim() || '';

  if (!/^[a-z0-9_-]{12,128}$/i.test(trimmedParticipantId)) {
    throw new Error('INVALID_PARTICIPANT_ID');
  }

  return trimmedParticipantId;
}

export function validateSongId(songId?: string | null): string {
  const trimmedSongId = songId?.trim() || '';

  if (!/^[a-z0-9-_:]{2,160}$/i.test(trimmedSongId)) {
    throw new Error('INVALID_SONG_ID');
  }

  return trimmedSongId;
}

export function validateRating(rating?: number | null): number {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('INVALID_RATING');
  }

  return rating;
}

export function validatePerformedByUs(performedByUs?: boolean | null): boolean {
  if (performedByUs === undefined || performedByUs === null) {
    return true;
  }

  if (typeof performedByUs !== 'boolean') {
    throw new Error('INVALID_PERFORMED_BY_US');
  }

  return performedByUs;
}

export function mapApiError(error: unknown) {
  const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';

  switch (message) {
    case 'METHOD_NOT_ALLOWED':
      return createJsonResponse(405, { message: 'Method not allowed.' });
    case 'EMPTY_BODY':
    case 'INVALID_JSON':
    case 'INVALID_SONG_ID':
    case 'INVALID_RATING':
    case 'INVALID_PERFORMED_BY_US':
    case 'INVALID_PARTICIPANT_ID':
    case 'MESSAGE_REQUIRED':
      return createJsonResponse(400, { message: 'Ongeldige aanvraag.' });
    case 'ORIGIN_REQUIRED':
    case 'ORIGIN_NOT_ALLOWED':
      return createJsonResponse(403, { message: 'Deze origin is niet toegestaan.' });
    case 'RATE_LIMITED':
      return createJsonResponse(429, { message: 'Te veel verzoeken. Probeer het later opnieuw.' });
    case 'HONEYPOT_TRIGGERED':
      return createJsonResponse(400, { message: 'Ongeldige aanvraag.' });
    default:
      return createJsonResponse(500, { message: 'Er ging iets mis op de server.' });
  }
}
