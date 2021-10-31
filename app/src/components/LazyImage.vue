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
        :class="imgClasses"
        :src="media.landscape.src"
        :sizes="media.landscape.sizes"
        :data-src="media.landscape.src"
        :data-srcset="getSrcset"
        loading="lazy"
        :alt="media.landscape.alt"
      />
    </picture>
  </figure>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

interface ImageInterface {
  src: string;
  srcset: [number];
  sizes?: string;
  alt?: string;
}

interface MediaInterface {
  landscape: ImageInterface;
  portrait?: ImageInterface;
}

export default defineComponent({
  name: 'LazyImage',
  inject: ['lazyload'],
  props: {
    media: {
      type: Object as PropType<MediaInterface>,
      default(this: void) {
        return {
          portrait: {
            srcset: [300, 768, 1024, 3108],
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
    const imgClasses = 'top-right or whatever';
    const getSrcset = computed(() => {
      const srcsetSizes = props.media.landscape.srcset.map(
        (width) => `${props.media.landscape.src}?width${width} ${width}w`,
      );
      return srcsetSizes.join(',');
    });
    return { getSrcset, imgClasses };
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
