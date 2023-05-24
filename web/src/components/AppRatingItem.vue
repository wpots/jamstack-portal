<template>
  <li class="rating-item" @click="handleClick">
    <slot></slot>
    <span class="rating">
      <svg class="icon-heart" :class="ratedClass(i)" v-for="i in rating.range" :key="i">
        <use href="#icon-heart" :mask="ratedMask(i)"></use>
      </svg>
    </span>
  </li>
  <dialog class="modal" ref="modal">
    <div class="modal-header">
      <slot></slot>
      <p>jouw beoordeling...</p>
    </div>
    <div class="modal-content">
      <div class="rating">
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
      <button type="dismiss" class="btn--default" @click="handleModalClose">annuleer</button
      ><button type="submit" class="btn--primary" @click="handleSubmit">verstuur</button>
    </div>
  </dialog>
</template>
<script lang="ts">
import { defineComponent, computed, ref, reactive } from 'vue';
import { useFeedback } from '../composables/useFeedback';
export default defineComponent({
  name: 'AppRatingItem',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const loading = ref(false);
    const rateSelect = ref<HTMLElement[] | null>(null);
    const rating = reactive({
      icon: 'heart',
      range: 5,
      selected: null,
    });
    const modal = ref<HTMLDialogElement | null>(null);
    const { getSongRatings, resolveSongRating, setUserRating } = useFeedback();
    const getPercentage = ref('50%');
    const currentRating = computed(() => {
      return resolveSongRating(props.id);
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
      if (modal.value) {
        modal.value.showModal();
      }
    };

    const resetRating = () => {
      if (rateSelect.value) {
        rateSelect.value.forEach(el => {
          el.classList.remove('love');
        });
      }
    };
    const handleRatingSelect = i => {
      resetRating();
      rateSelect.value?.forEach((el, index) => {
        if (index < i) {
          el.classList.add('love');
        }
      });
      rating.selected = i;
    };

    const handleSubmit = async e => {
      loading.value = true;
      if (rating.selected) {
        setUserRating({ id: props.id, rating: rating.selected });
      }
      modal.value?.close();
    };

    const handleModalClose = () => {
      if (modal.value?.open) {
        resetRating();
        modal.value.close();
      }
    };

    return {
      rating,
      currentRating,
      getPercentage,
      ratedClass,
      ratedMask,
      modal,
      rateSelect,
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
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: 0.15s ease-in-out;

  &:not(&:last-of-type) {
    border-bottom: 1px solid $smoke;
  }
  &:hover {
    transform: scale(1.1);
  }
}
.rating {
  margin-left: 1rem;

  .modal-content & {
    --icon-size: 3rem;
    margin-left: 0;
    display: flex;
    justify-content: space-around;
  }
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
    }
  }
  .modal-content {
    padding: 2rem 0;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;

    button {
      margin: 0 1rem;
    }
  }
}
</style>
