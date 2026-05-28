import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type FeatureWindowOptions = {
  enabled?: string;
  openAt?: string;
  closeAt?: string;
  now?: number;
};

type FeedbackAvailabilityState = {
  isVotingOpen: boolean;
  isFeedbackOpen: boolean;
};

function readEnvValue(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = import.meta.env[key as keyof ImportMetaEnv];

    if (value) {
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

function isFeatureOpen({
  enabled,
  openAt,
  closeAt,
  now = Date.now(),
}: FeatureWindowOptions): boolean {
  const isEnabled = parseBooleanValue(enabled);
  const openAtTimestamp = parseDateValue(openAt);
  const closeAtTimestamp = parseDateValue(closeAt);

  if (isEnabled === false) {
    return false;
  }

  if (openAtTimestamp !== null && now < openAtTimestamp) {
    return false;
  }

  if (closeAtTimestamp !== null && now > closeAtTimestamp) {
    return false;
  }

  return true;
}

export function getFeedbackAvailability(now = Date.now()): FeedbackAvailabilityState {
  return {
    isVotingOpen: isFeatureOpen({
      enabled: readEnvValue('VITE_VOTING_ENABLED', 'VUE_APP_VOTING_ENABLED'),
      openAt: readEnvValue('VITE_VOTING_OPEN_AT', 'VUE_APP_VOTING_OPEN_AT'),
      closeAt: readEnvValue('VITE_VOTING_CLOSE_AT', 'VUE_APP_VOTING_CLOSE_AT'),
      now,
    }),
    isFeedbackOpen: isFeatureOpen({
      enabled: readEnvValue('VITE_FEEDBACK_ENABLED', 'VUE_APP_FEEDBACK_ENABLED'),
      openAt: readEnvValue('VITE_FEEDBACK_OPEN_AT', 'VUE_APP_FEEDBACK_OPEN_AT'),
      closeAt: readEnvValue('VITE_FEEDBACK_CLOSE_AT', 'VUE_APP_FEEDBACK_CLOSE_AT'),
      now,
    }),
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
    isVotingOpen: computed(() => availability.value.isVotingOpen),
    isFeedbackOpen: computed(() => availability.value.isFeedbackOpen),
  };
}
