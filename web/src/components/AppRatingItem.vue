<template>
  <article
    v-bind="$attrs"
    class="rating-item"
    :class="{
      'rating-item--interactive': interactive,
      'rating-item--rated': isRated,
      'rating-item--grid': layout === 'grid',
    }"
    :aria-controls="interactive ? dialogId : undefined"
    :aria-expanded="interactive ? String(Boolean(modal?.open)) : undefined"
    :aria-haspopup="interactive ? 'dialog' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :role="interactive ? 'button' : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <div class="rating-item__body">
      <slot>
        <AppSongCard :artist="songArtist" :image-url="songAlbumArt" :title="songTitle" />
      </slot>
    </div>

    <div v-if="showSummary || interactive" class="rating-item__footer">
      <div v-if="showSummary" class="rating-summary">
        <div class="rating">
          <span class="rating-hearts" :aria-label="currentRatingLabel">
            <svg class="icon-heart" :class="ratedClass(i)" v-for="i in rating.range" :key="i">
              <use href="#icon-heart" :mask="ratedMask(i)"></use>
            </svg>
          </span>
          <small v-if="currentRating?.avg" class="meta">{{ currentRating.avg }}</small>
        </div>
        <small v-if="currentRating?.count" class="muted"
          >{{ currentRating.count }} beoordelingen</small
        >
        <small v-else class="muted">geen beoordelingen</small>
      </div>

      <div v-if="interactive" class="rating-item__action">
        <template v-if="!isRated">
          <svg class="icon-add" aria-hidden="true">
            <use href="#icon-plus"></use>
          </svg>
          <p class="fancy">stem ook!</p>
        </template>
        <template v-else>
          <svg class="icon-change" aria-hidden="true">
            <use href="#icon-chevron-down"></use>
          </svg>
        </template>
      </div>
    </div>
  </article>

  <teleport to="body">
    <dialog
      v-if="interactive"
      ref="modal"
      :id="dialogId"
      class="modal"
      :aria-labelledby="dialogTitleId"
      aria-modal="true"
      @close="handleDialogClosed"
      @click="handleDialogBackdropClick"
    >
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <slot name="modal-card">
            <AppSongCard
              :artist="songArtist"
              :heading-id="dialogTitleId"
              :image-url="songAlbumArt"
              :title="songTitle"
            />
          </slot>
          <p>Jouw beoordeling...</p>
        </div>

        <div class="modal-content">
          <div class="rating-hearts rating-hearts--selectable">
            <button
              v-for="i in rating.range"
              :key="i"
              ref="rateSelect"
              type="button"
              class="rating-heart-button"
              :aria-label="`${i} hart${i > 1 ? 'en' : ''}`"
              @click="handleRatingSelect(i)"
            >
              <svg class="icon-heart">
                <use href="#icon-heart"></use>
              </svg>
            </button>
          </div>
        </div>

        <form class="modal-actions" @submit.prevent="handleSubmit">
          <button type="button" class="btn--default" @click="handleModalClose">annuleer</button>
          <button type="submit" class="btn--primary" :disabled="loading">
            {{ submitText }}
          </button>
          <small>
            <span v-if="isRated && !loading">Bedankt voor jouw beoordeling!</span>
            <span v-if="submissionError">{{ submissionError }}</span>
          </small>
        </form>
      </div>
    </dialog>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref } from 'vue';
import AppSongCard from '@/components/AppSongCard.vue';
import { useFeedback } from '../composables/useFeedback';

function normalizeId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '');
}

export default defineComponent({
  name: 'AppRatingItem',
  inheritAttrs: false,
  components: { AppSongCard },
  props: {
    song: {
      type: Object,
      default: () => ({}),
    },
    interactive: {
      type: Boolean,
      default: true,
    },
    showSummary: {
      type: Boolean,
      default: true,
    },
    performedByUs: {
      type: Boolean,
      default: true,
    },
    layout: {
      type: String,
      default: 'default',
      validator: (value: string) => ['default', 'grid'].includes(value),
    },
  },
  setup(props) {
    const loading = ref(false);
    const modal = ref<HTMLDialogElement | null>(null);
    const rateSelect = ref<HTMLElement[] | null>(null);
    const submissionError = ref('');
    const rating = reactive({
      icon: 'heart',
      range: 5,
      selected: null as number | null,
    });
    const { getSongRatings, resolveSongRating, setUserRating, isRatedSong } = useFeedback();
    const songTitle = computed(() => props.song?.title || 'Onbekend nummer');
    const songArtist = computed(() => props.song?.artist || '');
    const songAlbumArt = computed(() => {
      const url = props.song?.albumart?.url;
      return url ? `${url}?w=150` : '';
    });
    const songId = computed(() => {
      return props.song?.sys?.id || `rating-${normalizeId(songTitle.value)}`;
    });
    const dialogId = computed(() => `rating-dialog-${normalizeId(songId.value)}`);
    const dialogTitleId = computed(() => `${dialogId.value}-title`);
    const currentRating = computed(() => resolveSongRating(songId.value));
    const isRated = computed(() => isRatedSong(songId.value));
    const submitText = computed(() => (isRated.value ? 'aanpassen' : 'verstuur'));
    const currentRatingLabel = computed(() => {
      if (!currentRating.value?.avg || !currentRating.value?.count) {
        return 'geen beoordelingen';
      }

      return `${currentRating.value.avg} op 5, ${currentRating.value.count} beoordelingen`;
    });

    const ratedClass = computed(() => (i: number) => {
      const rate = currentRating.value?.trunc;
      const per = currentRating.value?.percentage;

      if ((rate && rate >= i) || (per && rate === i - 1)) {
        return 'love';
      }

      return undefined;
    });

    const ratedMask = computed(() => (i: number) => {
      const per = currentRating.value?.percentage;
      const trunc = currentRating.value?.trunc;

      if (per && trunc && i === trunc + 1) {
        return 'url(#half)';
      }

      return undefined;
    });

    const resetRating = () => {
      if (rateSelect.value) {
        rateSelect.value.forEach(el => {
          el.classList.remove('love', 'pulse');
        });
      }
    };

    let savedScrollY = 0;

    const restoreScrollPosition = () => {
      if (globalThis.window === undefined) {
        return;
      }

      globalThis.requestAnimationFrame(() => {
        globalThis.window.scrollTo(0, savedScrollY);
      });
    };

    const openModal = async () => {
      if (props.interactive && modal.value && !modal.value.open) {
        savedScrollY = globalThis.window?.scrollY ?? 0;
        submissionError.value = '';

        // If the user already rated this song, reflect that selection in the modal
        const userRating = isRatedSong(songId.value);

        // Wait for DOM refs to be available then apply selection classes
        await nextTick();

        if (userRating?.rating) {
          handleRatingSelect(userRating.rating);
        } else {
          rating.selected = null;
          resetRating();
        }

        modal.value.showModal();
      }
    };

    const handleClick = () => {
      openModal();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (!props.interactive) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
      }
    };

    const handleRatingSelect = (value: number) => {
      resetRating();
      rateSelect.value?.forEach((el, index) => {
        if (index < value) {
          el.classList.add('love');
        }

        if (index === value - 1) {
          el.classList.add('pulse');
        }
      });
      rating.selected = value;
    };

    const handleSubmit = async () => {
      submissionError.value = '';
      loading.value = true;
      savedScrollY = globalThis.window?.scrollY ?? savedScrollY;

      try {
        if (rating.selected) {
          await setUserRating({
            id: songId.value,
            rating: rating.selected,
            performedByUs: props.performedByUs,
          });
        }

        modal.value?.close();
      } catch (error) {
        submissionError.value =
          error instanceof Error ? error.message : 'Stemmen is mislukt. Probeer het opnieuw.';
      } finally {
        loading.value = false;
      }
    };

    const handleDialogClosed = () => {
      if (globalThis.document !== undefined) {
        (globalThis.document.activeElement as HTMLElement | null)?.blur();
      }

      restoreScrollPosition();

      if (!isRated.value) {
        resetRating();
      }
    };

    const handleModalClose = () => {
      if (modal.value?.open) {
        modal.value.close();
      }
    };

    const handleDialogBackdropClick = (event: MouseEvent) => {
      if (event.target === modal.value) {
        handleModalClose();
      }
    };

    return {
      currentRating,
      currentRatingLabel,
      dialogId,
      dialogTitleId,
      getSongRatings,
      handleClick,
      handleDialogBackdropClick,
      handleDialogClosed,
      handleKeydown,
      handleModalClose,
      handleRatingSelect,
      handleSubmit,
      isRated,
      loading,
      modal,
      openModal,
      rateSelect,
      ratedClass,
      ratedMask,
      rating,
      songAlbumArt,
      songArtist,
      songTitle,
      submissionError,
      submitText,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;
@use '@/assets/styles/common/mixins' as *;

.rating-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

  margin-top: 0.5rem;
  height: 100%;
  max-width: 256px;
  background: $white;
  box-shadow: 1px 2px 5px rgba($black, 0.2);

  /* Remove flex: 1 0 100% to prevent children from stretching and overlapping image */
  & > * {
    flex: initial;
  }

  &.rating-item--interactive {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid $magenta;
    outline-offset: 4px;
  }

  &.rating-item--grid {
    width: 100%;
    max-width: none;
    margin-top: 0;

    & > * {
      flex: unset;
    }

    .rating-item__body {
      flex: 1 1 auto;
      padding: 0.85rem 0.85rem 0.65rem;
      display: flex;
      flex-direction: column;

      & > * {
        flex: 0 0 auto;
        width: 100%;
      }
    }

    .rating-item__footer {
      flex: 0 0 auto;
      width: 100%;
      padding: 0.65rem 0.85rem 0.85rem;
      margin-top: auto;
      border-top: 1px solid rgba($black, 0.06);
      align-items: flex-start;
    }

    :deep(.song-meta) {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;

      img,
      .song-art-fallback {
        flex: 0 0 4.5rem;
        width: 4.5rem;
        height: 4.5rem;
        max-width: none;
      }

      .song-art-fallback {
        aspect-ratio: 1;
        font-size: 0.95rem;
      }

      .song-title {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.2rem;

        h3,
        h4 {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        small {
          display: block;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.rating-item__body {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;

  & > * {
    flex: 1 1 auto;
  }
}

.rating-item__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 1rem 1rem;
  margin-top: auto;
}

.icon-change,
.icon-add {
  margin-right: 0;
  padding: 0.3rem;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid currentColor;
  fill: currentColor;
  flex: 0 0 auto;
  margin-left: auto;
}

.fancy {
  position: absolute;
  bottom: 1.5rem;
  right: 2rem;
  font-size: 0.9em;
  font-family: 'Satisfy', cursive;
  font-weight: bold;
  color: $tundora;
  transform: rotate3d(1, 1, 1, -25deg);
}

.rating-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  min-width: 0;
}

.rating-item__action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
  flex-shrink: 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.rating-hearts--selectable {
  --icon-size: 3rem;
  display: flex;
  justify-content: space-around;
}

.rating-heart-button {
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid $magenta;
    outline-offset: 4px;
    border-radius: 999px;
  }
}

.meta {
  font-weight: bold;
  margin-left: 0;
}

.muted {
  color: $gray;
  font-size: 0.7em;
  font-style: italic;
}

@keyframes pulse-animation {
  0% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.pulse {
  animation: pulse-animation 1s 2;
}

.icon-heart {
  fill: #fbcce7;
  width: var(--icon-size, 1rem);
  height: var(--icon-size, 1rem);
  transition: 0.2s ease-in;

  &.love,
  .love & {
    fill: $magenta;
  }
}

.modal {
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid $smoke;

  &::backdrop {
    background: rgba($black, 0.55);
  }
}

.modal-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-header {
  font-size: 1.5rem;

  p {
    font-size: 1rem;
    padding-top: 1rem;
  }
}

.modal-content {
  padding: 2rem 0;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  button {
    margin: 0 0.5rem;
  }

  small {
    flex: 1 0 100%;
    padding: 1rem;
    text-align: right;
    font-style: italic;
  }
}
</style>
