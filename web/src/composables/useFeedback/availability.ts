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
