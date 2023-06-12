<template>
  <li class="rating-item" @click="handleClick">
    <div class="song-meta">
      <img :src="`${song.albumart.url}?w=150`" :alt="song.title" />
      <div class="song-title">
        <h4>{{ song.title }}</h4>
        <small> {{ song.artist }}</small>
      </div>
    </div>

    <div class="rating">
      <span class="rating-hearts">
        <svg class="icon-heart" :class="ratedClass(i)" v-for="i in rating.range" :key="i">
          <use href="#icon-heart" :mask="ratedMask(i)"></use>
        </svg>
      </span>
      <small v-if="currentRating?.avg" class="meta"> {{ currentRating.avg }}</small>
    </div>
    <div v-if="currentRating?.count">
      <small class="muted">{{ currentRating.count }} beoordelingen </small>
    </div>
    <template v-if="interactive">
      <template v-if="!isRated">
        <svg class="icon-add">
          <use href="#icon-plus"></use>
        </svg>
        <p class="fancy">stem ook!</p>
      </template>
      <template v-else>
        <svg class="icon-change">
          <use href="#icon-chevron-down"></use>
        </svg>
      </template>
    </template>
    <dialog v-if="interactive" class="modal" ref="modal">
      <div class="modal-header">
        <slot></slot>
        <p>jouw beoordeling...</p>
      </div>
      <div class="modal-content">
        <div class="rating-hearts">
          <svg
            class="icon-heart"
            v-for="i in rating.range"
            :key="i"
            @click="handleRatingSelect(i)"
            ref="rateSelect"
          >
            <use href="#icon-heart"></use>
          </svg>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn--default" @click="handleModalClose">annuleer</button
        ><button type="submit" class="btn--primary" @click="handleSubmit">
          {{ submitText }}
        </button>
        <small
          ><span></span
          ><span v-if="isRated && !loading">Bedankt voor jouw beoordeling!</span></small
        >
      </div>
    </dialog>
  </li>
</template>
<script lang="ts">
import { defineComponent, computed, ref, reactive } from 'vue';
import { useFeedback } from '../composables/useFeedback';
export default defineComponent({
  name: 'AppRatingItem',
  props: {
    song: {
      type: Object,
      default: () => ({}),
    },
    rated: {
      type: [Object, Boolean],
      default: false,
    },
    interactive: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const loading = ref(false);
    const songId = computed(() => props.song.sys.id);
    const rateSelect = ref<HTMLElement[] | null>(null);
    const rating = reactive({
      icon: 'heart',
      range: 5,
      selected: null,
    });
    const modal = ref<HTMLDialogElement | null>(null);
    const { getSongRatings, resolveSongRating, setUserRating, isRatedSong } = useFeedback();

    const currentRating = computed(() => {
      return resolveSongRating(songId.value);
    });
    const ratedClass = computed(() => i => {
      const rate = currentRating?.value?.trunc;
      const per = currentRating?.value?.percentage;
      if ((rate && rate >= i) || (per && rate === i - 1)) return 'love';
    });

    const ratedMask = computed(() => i => {
      const per = currentRating?.value?.percentage;
      const trunc = currentRating?.value?.trunc;
      if (per && trunc && i === trunc + 1) {
        return 'url(#half)';
      }
    });

    const handleClick = () => {
      if (props.interactive && modal.value) {
        modal.value.showModal();
      }
    };
    const isRated = computed(() => isRatedSong(songId.value));
    const resetRating = () => {
      if (rateSelect.value) {
        rateSelect.value.forEach(el => {
          el.classList.remove('love');
        });
      }
    };
    const submitText = computed(() => (isRated.value ? 'aanpassen' : 'verstuur'));
    const handleRatingSelect = i => {
      resetRating();
      rateSelect.value?.forEach((el, index) => {
        if (index < i) {
          el.classList.add('love');
        }
        if (index === i - 1) {
          el.classList.add('pulse');
        }
      });
      rating.selected = i;
    };

    const handleSubmit = async () => {
      loading.value = true;
      if (rating.selected) {
        setUserRating({ id: songId.value, rating: rating.selected });
      }
      loading.value = false;
      modal.value?.close();
    };

    const handleModalClose = () => {
      if (modal.value?.open) {
        modal.value.close();
      }
      if (!isRated.value) resetRating();
    };

    return {
      loading,
      rating,
      currentRating,
      ratedClass,
      ratedMask,
      modal,
      rateSelect,
      isRated,
      submitText,
      handleClick,
      handleRatingSelect,
      handleSubmit,
      handleModalClose,
      getSongRatings,
    };
  },
});
</script>
<style lang="scss" scoped>
.rating-item {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem;
  margin-top: 0.5rem;
  max-width: 228px;
  background: white;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  & > * {
    flex: 1 0 100%;
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
  font-family: 'Satisfy';
  font-weight: bold;
  color: $tundora;
  transform: rotate3d(1, 1, 1, -25deg);
}

.rating {
  margin-top: 1rem;
}
.rating-hearts {
  .modal-content & {
    --icon-size: 3rem;
    display: flex;
    justify-content: space-around;
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

  img {
    flex: 0 0 20%;
    max-width: 20%;
    border: 2px solid $smoke;
    border-radius: 4px;
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

  &.love {
    fill: $magenta;
  }
}
.modal {
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid $smoke;
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
}
</style>
