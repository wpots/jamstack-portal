<template>
  <div class="list__items col-xs-12" v-if="songs?.length > 0">
    <transition-group class="row shuffle" name="shuffle" tag="ul">
      <RepertoirItem
        v-for="song in songs"
        class="list__item shuffle-item col-6 col-md-4"
        :key="song.title"
        :song="song"
      />
    </transition-group>
  </div>
</template>
<script>
import RepertoirItem from './RepertoirItem.vue';
export default {
  components: { RepertoirItem },
  name: 'RepertoirList',
  props: {
    songs: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>
<style lang="scss" scoped>
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
