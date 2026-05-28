<template>
  <article
    v-bind="$attrs"
    class="rating-item"
    :class="{ 'rating-item--interactive': interactive, 'rating-item--rated': isRated }"
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

  <dialog
    v-if="interactive"
    ref="modal"
    :id="dialogId"
    class="modal"
    :aria-labelledby="dialogTitleId"
    aria-modal="true"
    @click="handleDialogBackdropClick"
  >
    <div class="modal-card">
      <div class="modal-header">
        <slot name="modal-card">
          <AppSongCard
            :artist="songArtist"
            :heading-id="dialogTitleId"
            :image-url="songAlbumArt"
            :title="songTitle"
          />
        </slot>
        <p>jouw beoordeling...</p>
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

      <div class="modal-actions">
        <button type="button" class="btn--default" @click="handleModalClose">annuleer</button>
        <button type="submit" class="btn--primary" @click="handleSubmit">
          {{ submitText }}
        </button>
        <small>
          <span v-if="isRated && !loading">Bedankt voor jouw beoordeling!</span>
          <span v-if="submissionError">{{ submissionError }}</span>
        </small>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
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
        return 'Nog geen beoordelingen';
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
        rateSelect.value.forEach((el) => {
          el.classList.remove('love', 'pulse');
        });
      }
    };

    const openModal = () => {
      if (props.interactive && modal.value && !modal.value.open) {
        submissionError.value = '';
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

      try {
        if (rating.selected) {
          await setUserRating({ id: songId.value, rating: rating.selected });
        }

        modal.value?.close();
      } catch (error) {
        submissionError.value =
          error instanceof Error ? error.message : 'Stemmen is mislukt. Probeer het opnieuw.';
      } finally {
        loading.value = false;
      }
    };

    const handleModalClose = () => {
      if (modal.value?.open) {
        modal.value.close();
      }

      if (!isRated.value) {
        resetRating();
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
  flex-flow: row wrap;
  align-items: flex-end;
  justify-content: space-between;

  margin-top: 0.5rem;
  max-width: 228px;
  background: $white;
  box-shadow: 1px 2px 5px rgba($black, 0.2);

  & > * {
    flex: 1 0 100%;
  }

  &.rating-item--interactive {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid $magenta;
    outline-offset: 4px;
  }
}

.rating-item__body {
  flex: 1 0 100%;
}

.rating-item__footer {
  display: contents;
}

.icon-change,
.icon-add {
  margin-right: 1rem;
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
  display: contents;
}

.rating-item__action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
}

.rating {
  margin-top: 1rem;
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
  margin-left: 0.5rem;
  align-self: flex-end;
}

.muted {
  color: $gray;
  font-size: 0.7em;
  font-style: italic;
  align-self: flex-end;
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
