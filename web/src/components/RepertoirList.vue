<template>
  <div class="list__items" v-if="songs?.length > 0">
    <transition-group class="list list--figure row shuffle" name="shuffle" tag="ul">
      <component
        :is="componentType"
        :interactive="false"
        v-for="song in songs"
        class="list__item shuffle-item col-6 col-md-4"
        :key="song.title"
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
  },
  setup(props) {
    const componentType = props.showRatings ? AppRatingItem : RepertoirItem;

    return { componentType };
  },
});
</script>
<style lang="scss" scoped>
@use "@/assets/styles/common/variables" as *;
@use "@/assets/styles/common/mixins" as *;
h3 {
  font-size: 1em !important;
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
