<template>
  <li>
    <div class="list-item__content row">
      <div class="list-item__figure col-3">
        <LazyImage
          class="content"
          :srcset="[100]"
          :media="{ landscape: { src: song.albumart?.url, alt: song.title } }"
        />
      </div>

      <div class="list-item__details col-9">
        <h3 class="list-item__title">{{ song.title }}</h3>
        <p class="list-item__meta">{{ song.artist }}</p>
      </div>
    </div>
  </li>
</template>
<script>
import LazyImage from './LazyImage.vue';

export default {
  components: { LazyImage },
  name: 'RepertoirItem',
  props: {
    song: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>
