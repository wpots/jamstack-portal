<template>
  <figure role="presentation" data-lazy="true">
    <picture>
      <source
        v-if="media.portrait.src"
        :srcset="media.portrait.src"
        type="image/jpeg"
        media="(orientation:portrait)"
      />

      <img
        :class="imageClasses"
        :src="getImageInFormat(20)"
        :sizes="sizes"
        :data-src="getImageInFormat(2020)"
        :data-srcset="getImageSrcSet('jpg')"
        loading="lazy"
        :alt="alt"
      />
      />
    </picture>
  </figure>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import MediaInterface from '@/interfaces/MediaInterface';

export default defineComponent({
  name: 'LazyImage',
  props: {
    media: {
      type: Object as PropType<MediaInterface>,
      default() {
        return {
          portrait: {
            src: 'http://www.goedgebekt.com/core/wp-content/uploads/2016/11/gg_portrait.jpg',
          },
          landscape: {
            srcset: [300, 768, 1024, 3108],
            src: 'http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1.jpg ',
            sizes: '(max-width: 3108px) 100vw, 3108px',
          },
        };
      },
    },
  },
  setup(props) {
    const getSrcset = () => {
      const srcsetSizes = props.media.landscape.srcset.map(
        /* e.g: http://test.com/my-image@360.jpeg 480w, */
        // width => `${props.src}@${width}.${format} ${width}w`,
        (width) => `${props.media.landscape.src}?auto=webp&format=pjpg&width${width} ${width}w`,
      );
      return srcsetSizes.join(',');
    };
    return { getSrcset };
  },
});
</script>
<style lang="scss" scoped>
figure {
  position: relative;
  margin: 0;
  padding: 0;
  overflow: hidden;
  min-height: 40vh;

  img {
    @include size(100%);
    @include object-fit(cover, top);
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(36px);
    transition: filter 0.3s ease-in;

    &.top-left {
      @include object-fit(cover, left top);
    }
  }
}
.loaded img {
  filter: none;
}
</style>
