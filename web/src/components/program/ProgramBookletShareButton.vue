<template>
  <div class="program-booklet-share-root">
    <button
      ref="triggerButton"
      type="button"
      class="program-booklet-share"
      :class="{
        'program-booklet-share--floating': !isCompact,
        'program-booklet-share--compact': isCompact,
      }"
      aria-label="Deel boekje"
      :aria-controls="dialogId"
      :aria-expanded="String(Boolean(modal?.open))"
      aria-haspopup="dialog"
      @click="handleOpen"
    >
      <span class="program-booklet-share__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.48 2.48 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 15 5a3 3 0 0 0 .04.49L7.99 9.6a3 3 0 1 0 0 4.79l7.05 4.12c-.03.15-.04.32-.04.49a3 3 0 1 0 3-2.92Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span class="program-booklet-share__label">Deel programma</span>
    </button>

    <teleport to="body">
      <dialog
        ref="modal"
        :id="dialogId"
        class="program-booklet-share__modal"
        :aria-labelledby="titleId"
        aria-modal="true"
        @click="handleBackdropClick"
        @close="handleDialogClose"
      >
        <article class="program-booklet-share__card">
          <header class="program-booklet-share__header">
            <div>
              <h2 :id="titleId">Programma boekje</h2>
            </div>
            <button
              type="button"
              class="program-booklet-share__close"
              aria-label="Sluit QR-venster"
              @click="handleClose"
            >
              ×
            </button>
          </header>

          <p class="program-booklet-share__description">
            Open deze QR zodat je buurman het programma meteen op z'n telefoon heeft.
          </p>

          <div class="program-booklet-share__qr-shell">
            <img
              class="program-booklet-share__qr"
              :src="qrCodeDataUrl"
              alt="QR-code om het programma-boekje te openen"
            />
          </div>

          <a class="program-booklet-share__link" :href="shareUrl"> directe link naar programma</a>
        </article>
      </dialog>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'ProgramBookletShareButton',
  props: {
    compactAfterSelector: {
      type: String,
      default: '.program-page-navigation',
    },
  },
  setup(props) {
    const modal = ref<HTMLDialogElement | null>(null);
    const triggerButton = ref<HTMLButtonElement | null>(null);
    // Use the provided static QR image and hardcoded URL
    const qrCodeDataUrl = ref('/img/concerts/double-impact-programma.png');
    const isCompact = ref(false);
    const dialogId = 'program-booklet-share-dialog';
    const titleId = `${dialogId}-title`;
    const shareUrl = computed(() => 'https://goedgebekt.com/concerts/double-impact/programma');

    const handleOpen = () => {
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

    const updateVisibility = () => {
      if (globalThis.window === undefined || typeof document === 'undefined') {
        isCompact.value = false;
        return;
      }

      const compactTarget = document.querySelector(props.compactAfterSelector);

      if (!(compactTarget instanceof HTMLElement)) {
        isCompact.value = false;
        return;
      }

      isCompact.value = compactTarget.getBoundingClientRect().top <= 0;
    };

    onMounted(() => {
      updateVisibility();
      globalThis.addEventListener('scroll', updateVisibility, { passive: true });
      globalThis.addEventListener('resize', updateVisibility);
    });

    onBeforeUnmount(() => {
      if (globalThis.window !== undefined) {
        globalThis.removeEventListener('scroll', updateVisibility);
        globalThis.removeEventListener('resize', updateVisibility);
      }
    });

    return {
      dialogId,
      handleBackdropClick,
      handleClose,
      handleDialogClose,
      handleOpen,
      isCompact,
      modal,
      qrCodeDataUrl,
      shareUrl,
      titleId,
      triggerButton,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-booklet-share-root {
  pointer-events: none;
}

.program-booklet-share {
  position: fixed;
  right: 1rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.72rem 0.95rem;
  border: 0;
  border-radius: 999px;
  background: var(--program-color-accent, #6f42c1);
  color: $white;
  box-shadow: 0 16px 40px rgba($black, 0.24);
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  pointer-events: auto;
  transition:
    top 180ms ease,
    padding 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease,
    opacity 180ms ease,
    transform 180ms ease,
    color 180ms ease;

  &:focus-visible {
    outline: 3px solid var(--program-color-ink, #111111);
    outline-offset: 3px;
  }
}

.program-booklet-share--floating {
  top: 1rem;
  background: linear-gradient(90deg, rgba($green-alt, 0.9), rgba($green, 0.72), rgba($yellow, 0.9));
  color: $black;
  box-shadow: 0 12px 28px rgba($black, 0.2);
}

.program-booklet-share--compact {
  top: 0.7rem;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: $purple;
  color: $white;
  box-shadow: 0 10px 24px rgba($black, 0.18);
}

.program-booklet-share__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 999px;
  background: rgba($white, 0.18);

  svg {
    width: 1rem;
    height: 1rem;
  }
}

.program-booklet-share--compact .program-booklet-share__icon {
  width: 1.5rem;
  height: 1.5rem;
  background: rgba($white, 0.14);

  svg {
    width: 0.9rem;
    height: 0.9rem;
  }
}

.program-booklet-share--compact .program-booklet-share__label {
  display: none;
}

.program-booklet-share__modal {
  width: min(28rem, calc(100vw - 2rem));
  max-width: 28rem;
  padding: 0;
  border: 0;
  border-radius: 1.5rem;
  background: transparent;

  &::backdrop {
    background: rgba($black, 0.7);
  }
}

.program-booklet-share__card {
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: rgba($white, 0.98);
  box-shadow: 0 20px 50px rgba($black, 0.2);
}

.program-booklet-share__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  h2 {
    margin: 0;
    font-size: 1.4rem;
    line-height: 1.15;
    font-family: var(--program-font-display);
  }
}

.program-booklet-share__eyebrow {
  margin: 0 0 0.35rem;
  color: rgba($black, 0.58);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.program-booklet-share__close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba($black, 0.08);
  color: $black;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid var(--program-color-accent, #6f42c1);
    outline-offset: 2px;
  }
}

.program-booklet-share__description,
.program-booklet-share__link-label {
  margin: 1rem 0 0;
  font-family: var(--program-font-body);
}

.program-booklet-share__qr-shell {
  display: grid;
  place-items: center;
  min-height: 15rem;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba($black, 0.04);
}

.program-booklet-share__qr {
  display: block;
  width: min(100%, 18rem);
  height: auto;
  border-radius: 1rem;
}

.program-booklet-share__status {
  margin: 0;
  color: rgba($black, 0.7);
  text-align: center;
}

.program-booklet-share__status--error {
  color: #9d174d;
}

.program-booklet-share__link-label {
  color: rgba($black, 0.58);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.program-booklet-share__link {
  display: block;
  margin-top: 0.4rem;
  color: var(--program-color-accent, #6f42c1);
  word-break: break-word;

  &:focus-visible {
    outline: 3px solid var(--program-color-ink, #111111);
    outline-offset: 3px;
  }
}

@media (min-width: 992px) {
  .program-booklet-share--floating {
    top: 0.85rem;
    right: max(1rem, calc((100vw - 76rem) / 2 + 0.5rem));
    padding: 0.62rem 0.85rem;
    background: rgba($purple, 0.92);
    color: $white;
    box-shadow: 0 10px 24px rgba($black, 0.18);
  }

  .program-booklet-share--floating .program-booklet-share__icon {
    background: rgba($white, 0.14);
  }
}

@media (max-width: 767px) {
  .program-booklet-share {
    right: 0.75rem;
    padding: 0.64rem 0.85rem;
  }

  .program-booklet-share--floating {
    top: 0.75rem;
  }

  .program-booklet-share--compact {
    top: 0.55rem;
    width: 2.35rem;
    height: 2.35rem;
  }

  .program-booklet-share__label {
    font-size: 0.8rem;
  }

  .program-booklet-share__card {
    padding: 1rem;
  }
}
</style>
