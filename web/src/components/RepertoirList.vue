<template>
  <div class="list__items col-xs-12">
    <ul class="row shuffle" v-if="songs?.length > 0">
      <li v-for="(song, index) in songs" class="list__item col-6 col-md-4" :key="index">
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
    </ul>
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
</style>
