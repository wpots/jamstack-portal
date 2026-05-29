import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type FeatureWindowOptions = {
  enabled?: string;
  openAt?: string;
  closeAt?: string;
  now?: number;
};

export type FeatureAvailabilityStatus = 'disabled' | 'open' | 'closed';

type FeatureClosedReason = 'scheduled' | 'ended' | null;

type FeatureAvailability = {
  status: FeatureAvailabilityStatus;
  reason: FeatureClosedReason;
};

type FeedbackAvailabilityState = {
  votingStatus: FeatureAvailabilityStatus;
  votingReason: FeatureClosedReason;
  isVotingOpen: boolean;
  feedbackStatus: FeatureAvailabilityStatus;
  feedbackReason: FeatureClosedReason;
  isFeedbackOpen: boolean;
};

function readEnvValue(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = import.meta.env[key as keyof ImportMetaEnv];

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function parseBooleanValue(value?: string): boolean | null {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
    return false;
  }

  return null;
}

function parseDateValue(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Date.parse(value);

  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function resolveFeatureAvailability({
  enabled,
  openAt,
  closeAt,
  now = Date.now(),
}: FeatureWindowOptions): FeatureAvailability {
  const isEnabled = parseBooleanValue(enabled);
  const openAtTimestamp = parseDateValue(openAt);
  const closeAtTimestamp = parseDateValue(closeAt);

  if (isEnabled === false) {
    return {
      status: 'disabled',
      reason: null,
    };
  }

  if (openAtTimestamp !== null && now < openAtTimestamp) {
    return {
      status: 'closed',
      reason: 'scheduled',
    };
  }

  if (closeAtTimestamp !== null && now > closeAtTimestamp) {
    return {
      status: 'closed',
      reason: 'ended',
    };
  }

  return {
    status: 'open',
    reason: null,
  };
}

export type OpenFeedbackWindow = {
  startAt: number | null;
  endAt: number | null;
};

export type VotingWindow = OpenFeedbackWindow;

function getFeatureWindow(
  openAtKey: string,
  closeAtKey: string,
  fallbackOpenAtKey?: string,
  fallbackCloseAtKey?: string,
) {
  const openAt = parseDateValue(readEnvValue(openAtKey, fallbackOpenAtKey));
  const closeAt = parseDateValue(readEnvValue(closeAtKey, fallbackCloseAtKey));

  return {
    startAt: openAt,
    endAt: closeAt,
  };
}

export function getVotingWindow(): VotingWindow {
  return getFeatureWindow(
    'VITE_VOTING_OPEN_AT',
    'VITE_VOTING_CLOSE_AT',
    'VUE_APP_VOTING_OPEN_AT',
    'VUE_APP_VOTING_CLOSE_AT',
  );
}

export function getOpenFeedbackWindow(concertDateRaw?: string): OpenFeedbackWindow {
  const feedbackOpenAt = parseDateValue(
    readEnvValue('VITE_FEEDBACK_OPEN_AT', 'VUE_APP_FEEDBACK_OPEN_AT'),
  );
  const feedbackCloseAt = parseDateValue(
    readEnvValue('VITE_FEEDBACK_CLOSE_AT', 'VUE_APP_FEEDBACK_CLOSE_AT'),
  );

  let concertStartAt: number | null = null;

  if (concertDateRaw) {
    const concertDate = new Date(concertDateRaw);

    if (!Number.isNaN(concertDate.getTime())) {
      concertStartAt = concertDate.getTime();
    }
  }

  const startCandidates = [feedbackOpenAt, concertStartAt].filter(
    (value): value is number => value !== null,
  );

  let startAt: number | null = null;

  if (startCandidates.length > 0) {
    startAt = Math.min(...startCandidates);
  } else if (import.meta.env.DEV) {
    startAt = 0;
  }

  return {
    startAt,
    endAt: feedbackCloseAt,
  };
}

export function resolveFeedbackEntryTimestamp(
  entryDate?: number | string,
  updatedAt?: string,
): number | null {
  if (typeof entryDate === 'number' && Number.isFinite(entryDate)) {
    return entryDate;
  }

  if (typeof entryDate === 'string' && entryDate.trim()) {
    const parsedDate = Number(entryDate);

    if (Number.isFinite(parsedDate)) {
      return parsedDate;
    }
  }

  if (updatedAt) {
    const parsedUpdatedAt = Date.parse(updatedAt);

    if (!Number.isNaN(parsedUpdatedAt)) {
      return parsedUpdatedAt;
    }
  }

  return null;
}

export function isEntryInOpenFeedbackWindow(
  entryDate: number | string | undefined,
  window: OpenFeedbackWindow,
  updatedAt?: string,
): boolean {
  const timestamp = resolveFeedbackEntryTimestamp(entryDate, updatedAt);

  if (timestamp === null) {
    return false;
  }

  if (window.startAt !== null && timestamp < window.startAt) {
    return false;
  }

  if (window.endAt !== null && timestamp > window.endAt) {
    return false;
  }

  return true;
}

export function isVoteInVotingWindow(
  voteDate: number | string | undefined,
  window: VotingWindow,
  updatedAt?: string,
): boolean {
  const hasWindow = window.startAt !== null || window.endAt !== null;

  if (!hasWindow) {
    return true;
  }

  const timestamp = resolveFeedbackEntryTimestamp(voteDate, updatedAt);

  if (timestamp === null) {
    return true;
  }

  return isEntryInOpenFeedbackWindow(voteDate, window, updatedAt);
}

export function getFeedbackAvailability(now = Date.now()): FeedbackAvailabilityState {
  const votingAvailability = resolveFeatureAvailability({
    enabled: readEnvValue('VITE_VOTING_ENABLED', 'VUE_APP_VOTING_ENABLED'),
    openAt: readEnvValue('VITE_VOTING_OPEN_AT', 'VUE_APP_VOTING_OPEN_AT'),
    closeAt: readEnvValue('VITE_VOTING_CLOSE_AT', 'VUE_APP_VOTING_CLOSE_AT'),
    now,
  });
  const feedbackAvailability = resolveFeatureAvailability({
    enabled: readEnvValue('VITE_FEEDBACK_ENABLED', 'VUE_APP_FEEDBACK_ENABLED'),
    openAt: readEnvValue('VITE_FEEDBACK_OPEN_AT', 'VUE_APP_FEEDBACK_OPEN_AT'),
    closeAt: readEnvValue('VITE_FEEDBACK_CLOSE_AT', 'VUE_APP_FEEDBACK_CLOSE_AT'),
    now,
  });

  return {
    votingStatus: votingAvailability.status,
    votingReason: votingAvailability.reason,
    isVotingOpen: votingAvailability.status === 'open',
    feedbackStatus: feedbackAvailability.status,
    feedbackReason: feedbackAvailability.reason,
    isFeedbackOpen: feedbackAvailability.status === 'open',
  };
}

export function useFeedbackAvailability() {
  const now = ref(Date.now());
  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now();
    }, 30000);
  });

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });

  const availability = computed(() => getFeedbackAvailability(now.value));

  return {
    votingStatus: computed(() => availability.value.votingStatus),
    votingReason: computed(() => availability.value.votingReason),
    isVotingOpen: computed(() => availability.value.isVotingOpen),
    feedbackStatus: computed(() => availability.value.feedbackStatus),
    feedbackReason: computed(() => availability.value.feedbackReason),
    isFeedbackOpen: computed(() => availability.value.isFeedbackOpen),
  };
}
