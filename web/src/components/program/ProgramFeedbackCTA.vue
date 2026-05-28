<template>
  <div v-if="isFeedbackOpen || confirmationMessage" class="program-preview__feedback-bar">
    <p>{{ displayMessage }}</p>
    <button v-if="isFeedbackOpen" ref="triggerButton" type="button" @click="handleOpen">
      {{ buttonLabel }}
    </button>
  </div>

  <teleport to="body">
    <dialog
      v-if="isFeedbackOpen"
      ref="modal"
      class="program-preview__feedback-modal"
      aria-labelledby="program-feedback-title"
      aria-modal="true"
      @click="handleBackdropClick"
      @close="handleDialogClose"
    >
      <article class="program-preview__feedback-modal-card">
        <header class="program-preview__feedback-modal-header">
          <button
            type="button"
            class="program-preview__feedback-modal-close"
            aria-label="Sluit feedbackvenster"
            @click="handleClose"
          >
            ×
          </button>
        </header>

        <FeedBackForm @submitted="handleSubmitted" />
      </article>
    </dialog>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref } from 'vue';
import FeedBackForm from '@/components/FeedBackForm.vue';
import { useFeedbackAvailability } from '@/composables/useFeedback/availability';

export default defineComponent({
  name: 'ProgramFeedbackCTA',
  emits: ['click'],
  components: {
    FeedBackForm,
  },
  props: {
    message: {
      type: String,
      default: 'Na deze set: snelle vote + open feedback blijft beschikbaar.',
    },
    buttonLabel: {
      type: String,
      default: 'Geef je mening',
    },
  },
  setup(props, { emit }) {
    const modal = ref<HTMLDialogElement | null>(null);
    const triggerButton = ref<HTMLButtonElement | null>(null);
    const confirmationMessage = ref('');
    const { isFeedbackOpen } = useFeedbackAvailability();
    let confirmationTimeout: ReturnType<typeof setTimeout> | null = null;

    const displayMessage = computed(() => {
      if (confirmationMessage.value) {
        return confirmationMessage.value;
      }

      return props.message;
    });

    const clearConfirmationTimeout = () => {
      if (confirmationTimeout) {
        clearTimeout(confirmationTimeout);
        confirmationTimeout = null;
      }
    };

    const handleOpen = () => {
      if (isFeedbackOpen.value === false) {
        return;
      }

      emit('click');

      if (!modal.value?.open) {
        modal.value?.showModal();
      }
    };

    const handleClose = () => {
      if (modal.value?.open) {
        modal.value.close();
      }
    };

    const handleDialogClose = () => {
      triggerButton.value?.focus();
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === modal.value) {
        handleClose();
      }
    };

    const handleSubmitted = () => {
      confirmationMessage.value = 'Bedankt, je feedback is verstuurd.';
      clearConfirmationTimeout();
      confirmationTimeout = setTimeout(() => {
        confirmationMessage.value = '';
        confirmationTimeout = null;
      }, 4000);
      handleClose();
    };

    onBeforeUnmount(() => {
      clearConfirmationTimeout();
    });

    return {
      displayMessage,
      confirmationMessage,
      isFeedbackOpen,
      modal,
      triggerButton,
      handleOpen,
      handleClose,
      handleDialogClose,
      handleBackdropClick,
      handleSubmitted,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-preview__feedback-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: rgba($white, 0.82);
  box-shadow: 0 12px 24px rgba($black, 0.05);

  p {
    margin: 0;
    font-size: 0.9rem;
  }

  button {
    padding: 0.7rem 1rem;
    border: 0;
    border-radius: 999px;
    background: var(--program-color-accent);
    color: $white;
    font-family: var(--program-font-body);
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;

    &:focus-visible {
      outline: 2px solid var(--program-color-ink, #1b1b1b);
      outline-offset: 3px;
    }
  }
}

.program-preview__feedback-modal {
  width: min(42rem, calc(100vw - 2rem));
  max-width: 42rem;
  padding: 0;
  border: 0;
  border-radius: 1.5rem;
  background: transparent;

  &::backdrop {
    background: rgba($black, 0.6);
  }
}

.program-preview__feedback-modal-card {
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: rgba($white, 0.98);
  box-shadow: 0 20px 50px rgba($black, 0.18);
}

.program-preview__feedback-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
}

.program-preview__feedback-modal-kicker {
  margin-bottom: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.program-preview__feedback-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: 999px;
  background: rgba($black, 0.08);
  color: $black;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--program-color-accent);
    outline-offset: 2px;
  }
}

:deep(.feedback-form) {
  margin: 0;
}

:deep(.feedback-form h2) {
  margin-top: 0;
  font-family: var(--program-font-display);
}
:deep(.form-submit) {
  margin-top: 0;
  font-family: var(--program-font-body);
  border-radius: 999px;
  background: $purple;
}

@media (max-width: 900px) {
  .program-preview__feedback-bar {
    position: sticky;
    bottom: 1rem;
    z-index: 10;
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
    }
  }

  .program-preview__feedback-modal-card {
    padding: 1rem;
  }

  .program-preview__feedback-modal-header {
    align-items: center;
  }
}
</style>
