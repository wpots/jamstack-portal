<template>
  <div class="list__items col-xs-12" v-if="songs?.length > 0">
    <transition-group class="row shuffle" name="shuffle" tag="ul">
      <li v-for="song in songs" class="list__item shuffle-item col-6 col-md-4" :key="song.title">
        <div class="list__content row">
          <div class="list__figure col-3">
            <img class="content" :src="song.albumart?.url" :alt="song.title" />
          </div>

          <div class="list__details col-9">
            <h3 class="list__title">{{ song.title }}</h3>
            <p class="list__meta">{{ song.artist }}</p>
          </div>
        </div>
      </li>
    </transition-group>
  </div>
</template>
<script>
export default {
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
.shuffle-enter-active,
.shuffle-leave-active {
  // position: absolute;
}

.shuffle-move {
  transition: transform 0.4s ease;
}
</style>
