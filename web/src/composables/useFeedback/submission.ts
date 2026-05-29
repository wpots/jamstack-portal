import { computed, ref } from 'vue';

export const feedbackSubmittedStorageKey = 'goed-gebekt-feedback-submitted';

function readFeedbackSubmittedFromStorage(): boolean {
  if (globalThis.window === undefined) {
    return false;
  }

  return globalThis.window.localStorage.getItem(feedbackSubmittedStorageKey) === 'true';
}

const hasSubmittedFeedbackRef = ref(readFeedbackSubmittedFromStorage());

export function markFeedbackSubmitted(): void {
  hasSubmittedFeedbackRef.value = true;

  if (globalThis.window !== undefined) {
    globalThis.window.localStorage.setItem(feedbackSubmittedStorageKey, 'true');
  }
}

export function useFeedbackSubmissionState() {
  if (!hasSubmittedFeedbackRef.value) {
    hasSubmittedFeedbackRef.value = readFeedbackSubmittedFromStorage();
  }

  return {
    hasSubmittedFeedback: computed(() => hasSubmittedFeedbackRef.value),
    markFeedbackSubmitted,
  };
}
