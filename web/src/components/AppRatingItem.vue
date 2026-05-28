<template>
  <article
    class="rating-item"
    :class="[
      `rating-item--${variant}`,
      { 'rating-item--interactive': interactive, 'rating-item--rated': isRated },
    ]"
    :aria-controls="interactive ? dialogId : undefined"
    :aria-expanded="interactive ? String(Boolean(modal?.open)) : undefined"
    :aria-haspopup="interactive ? 'dialog' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :role="interactive ? 'button' : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <div class="song-meta">
      <img v-if="songAlbumArt" :src="songAlbumArt" :alt="songTitle" />
      <div v-else class="song-art-fallback" aria-hidden="true">
        <span>{{ songInitials }}</span>
      </div>
      <div class="song-title">
        <h4>{{ songTitle }}</h4>
        <small v-if="songArtist">{{ songArtist }}</small>
      </div>
    </div>

    <div class="rating-summary">
      <div class="rating">
        <span class="rating-hearts" :aria-label="currentRatingLabel">
          <svg class="icon-heart" :class="ratedClass(i)" v-for="i in rating.range" :key="i">
            <use href="#icon-heart" :mask="ratedMask(i)"></use>
          </svg>
        </span>
        <small v-if="currentRating?.avg" class="meta">{{ currentRating.avg }}</small>
      </div>
      <small v-if="currentRating?.count" class="muted">{{ currentRating.count }} beoordelingen</small>
    </div>

    <template v-if="interactive">
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
    </template>
  </article>

  <dialog
    v-if="interactive"
    ref="modal"
    :id="dialogId"
    class="modal"
    :class="`modal--${variant}`"
    :aria-labelledby="dialogTitleId"
    aria-modal="true"
    @click="handleDialogBackdropClick"
  >
    <div class="modal-card">
      <div class="modal-header">
        <slot>
          <div class="song-meta song-meta--modal">
            <img v-if="songAlbumArt" :src="songAlbumArt" :alt="songTitle" />
            <div v-else class="song-art-fallback song-art-fallback--modal" aria-hidden="true">
              <span>{{ songInitials }}</span>
            </div>
            <div class="song-title">
              <h4 :id="dialogTitleId">{{ songTitle }}</h4>
              <small v-if="songArtist">{{ songArtist }}</small>
            </div>
          </div>
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
        </small>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
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
  props: {
    song: {
      type: Object,
      default: () => ({}),
    },
    interactive: {
      type: Boolean,
      default: true,
    },
    variant: {
      type: String,
      default: 'default',
    },
  },
  setup(props) {
    const loading = ref(false);
    const modal = ref<HTMLDialogElement | null>(null);
    const rateSelect = ref<HTMLElement[] | null>(null);
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
    const songInitials = computed(() => {
      return songTitle.value
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
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
      loading.value = true;
      if (rating.selected) {
        await setUserRating({ id: songId.value, rating: rating.selected });
      }
      loading.value = false;
      modal.value?.close();
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
      rateSelect,
      ratedClass,
      ratedMask,
      rating,
      songAlbumArt,
      songArtist,
      songInitials,
      songTitle,
      submitText,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/common/variables" as *;
@use "@/assets/styles/common/mixins" as *;

.rating-item {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem;
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

.song-meta {
  display: flex;
  gap: 1rem;

  small {
    font-family: 'Julius Sans One', serif;
    color: $gray;
    font-size: 0.7em;
  }

  img,
  .song-art-fallback {
    flex: 0 0 20%;
    max-width: 20%;
    border: 2px solid $smoke;
    border-radius: 4px;
  }

  img {
    aspect-ratio: 1;
    object-fit: cover;
  }
}

.song-art-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba($magenta, 0.95), rgba($black, 0.9));
  color: $white;
  font-size: 1rem;
  font-weight: 700;
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

.rating-item--program-preview {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem 1rem;
  width: 100%;
  max-width: none;
  padding: 1.25rem 1.25rem 1rem;
  margin-top: 0;
  border-radius: 0;
  border: 0;
  box-shadow: 0 10px 24px rgba($black, 0.12);

  & > * {
    flex: initial;
  }

  .song-meta {
    display: none;
  }

  .rating-summary {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-top: 0;
  }

  .rating-hearts {
    display: inline-flex;
    gap: 0.15rem;
  }

  .icon-heart {
    --icon-size: 1.7rem;
  }

  .meta {
    margin-left: 0;
    font-size: 2.2rem;
    line-height: 1;
    color: $tundora;
    font-style: normal;
  }

  .muted {
    font-size: 0.9rem;
    color: rgba($tundora, 0.45);
  }

  .icon-change,
  .icon-add {
    width: 3rem;
    height: 3rem;
    padding: 0.85rem;
    margin: 0;
    border: 2px solid rgba($black, 0.65);
    justify-self: end;
    align-self: center;
    fill: rgba($black, 0.85);
    background: $white;
  }

  .fancy {
    position: static;
    align-self: center;
    margin-right: 0.35rem;
    font-size: 1.05rem;
    transform: rotate(-12deg);
  }
}

.modal--program-preview {
  width: min(58rem, calc(100vw - 2rem));
  max-width: 58rem;
  padding: 0;
  border: 0;
  border-radius: 1.1rem;
  background: transparent;
  box-shadow: none;

  .modal-card {
    padding: 1.9rem 1.9rem 1.6rem;
    border-radius: 1.1rem;
    background: rgba($white, 0.98);
    box-shadow: 0 24px 60px rgba($black, 0.18);
  }

  .modal-header {
    p {
      padding-top: 1.5rem;
      margin-bottom: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: $black;
    }
  }

  .song-meta--modal {
    align-items: flex-start;

    img,
    .song-art-fallback {
      flex: 0 0 11rem;
      width: 11rem;
      max-width: 11rem;
      border: 0;
      border-radius: 0.55rem;
      box-shadow: 0 8px 20px rgba($black, 0.18);
    }

    .song-title {
      padding-top: 0.25rem;
    }

    h4 {
      margin-bottom: 0.45rem;
      font-size: clamp(2.1rem, 4vw, 3.4rem);
      line-height: 1.04;
    }

    small {
      display: block;
      font-size: 0.95rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba($gray, 0.9);
    }
  }

  .song-art-fallback--modal {
    font-size: 2rem;
  }

  .modal-content {
    padding: 0.5rem 0 0;
  }

  .rating-hearts--selectable {
    gap: 1.5rem;
    justify-content: space-between;
  }

  .rating-heart-button .icon-heart {
    --icon-size: clamp(4rem, 9vw, 5.25rem);
    fill: #f6c1e0;
  }

  .modal-actions {
    align-items: center;
    margin-top: 0.5rem;

    button {
      min-width: 11.75rem;
      margin: 0;
      border: 0;
      border-radius: 0.45rem;
      font-size: 1rem;
      font-weight: 700;
      text-transform: lowercase;
    }

    .btn--default {
      background: #bfbfbf;
      color: $white;
    }

    .btn--primary {
      background: #ff2d7a;
      color: $white;
    }

    small {
      padding: 0.75rem 0 0;
      text-align: left;
    }
  }
}

@media (max-width: 900px) {
  .rating-item--program-preview {
    grid-template-columns: minmax(0, 1fr) auto;

    .meta {
      font-size: 1.9rem;
    }

    .muted {
      font-size: 0.82rem;
    }
  }

  .modal--program-preview {
    width: min(100vw - 1rem, 40rem);

    .modal-card {
      padding: 1.1rem;
    }

    .song-meta--modal {
      gap: 0.8rem;

      img,
      .song-art-fallback {
        flex: 0 0 5.8rem;
        width: 5.8rem;
        max-width: 5.8rem;
      }
    }

    .rating-hearts--selectable {
      gap: 0.35rem;
    }

    .modal-actions {
      gap: 0.75rem;

      button {
        flex: 1 1 calc(50% - 0.375rem);
        min-width: 0;
      }
    }
  }
}
</style>
