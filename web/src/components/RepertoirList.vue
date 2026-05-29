<template>
  <div class="list__items" v-if="songs?.length > 0">
    <transition-group
      class="list list--figure shuffle"
      :class="{ 'list--cards': showRatings, row: !showRatings }"
      name="shuffle"
      tag="div"
    >
      <component
        :is="componentType"
        :interactive="false"
        v-for="song in songs"
        class="list__item shuffle-item"
        :class="{ 'col-6 col-md-4': !showRatings }"
        :key="song.title"
        :layout="showRatings ? 'grid' : 'default'"
        :performed-by-us="performedByUs"
        :song="song"
      />
    </transition-group>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import AppRatingItem from './AppRatingItem.vue';
import RepertoirItem from './RepertoirItem.vue';

export default defineComponent({
  components: { RepertoirItem, AppRatingItem },
  name: 'RepertoirList',
  props: {
    showRatings: {
      type: Boolean,
      default: false,
    },
    songs: {
      type: Array,
      default: () => {
        return [];
      },
    },
    performedByUs: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const componentType = props.showRatings ? AppRatingItem : RepertoirItem;

    return { componentType, performedByUs: props.performedByUs };
  },
});
</script>
<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;
@use '@/assets/styles/common/mixins' as *;
h3 {
  font-size: 1em !important;
}

.list--cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 1rem;
  width: 100%;
  margin: 0;
  align-items: stretch;
}

.shuffle {
  align-items: stretch;
}

:deep(.list--cards .list__item) {
  display: flex;
  min-width: 0;
  height: 100%;
  padding: 0;
}

:deep(.list--cards .rating-item--grid) {
  flex: 1 1 auto;
  width: 100%;
}

.shuffle-item {
  transition: all 0.25s ease-in-out;
}
.shuffle-enter,
.shuffle-leave-to {
  opacity: 0;
  transform: scale(0.1);
}
.shuffle-enter-active {
  transform: scale(1.1);
}
.shuffle {
  position: relative;
}

.shuffle-move {
  transition: transform 0.4s ease;
}
</style>
