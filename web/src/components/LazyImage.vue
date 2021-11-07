<template>
  <figure role="presentation" ref="root" v-lazyload class>
    <picture>
      <source
        ref="portrait"
        v-if="media.portrait"
        :srcset="media.portrait.src"
        type="image/jpeg"
        media="(orientation:portrait)"
      />

      <img
        ref="landscape"
        :class="media.classes"
        :src="getImgBySize(20)"
        :sizes="media.landscape.sizes"
        :data-src="getImgBySize(2020)"
        :srcset="getSrcset(media.landscape)"
        loading="lazy"
        :alt="media.landscape.alt"
      />
    </picture>
  </figure>
</template>
<script lang="ts">
// eslint-disable-next-line
import { ref, defineComponent, PropType, computed } from 'vue';

interface ImageInterface {
  src: string;
  sizes?: string;
  alt?: string;
}

interface MediaInterface {
  landscape: ImageInterface;
  portrait?: ImageInterface;
  classes?: string;
}

const defaultmedia: MediaInterface = {
  portrait: {
    src: 'http://www.goedgebekt.com/core/wp-content/uploads/2016/11/gg_portrait.jpg',
  },
  landscape: {
    src: 'http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1.jpg ',
    sizes: '(max-width: 3108px) 100vw, 3108px',
    alt: 'placeholder default',
  },
  classes: 'default-classes',
};

export default defineComponent({
  name: 'LazyImage',
  props: {
    srcset: {
      type: Array,
      default: () => [375, 650, 900, 1500, 2020, 2740, 3840],
    },
    media: {
      type: Object as PropType<MediaInterface>,
      default: (): MediaInterface => defaultmedia,
    },
  },

  setup(props) {
    const root = ref<HTMLElement | null>(null);
    const getImgBySize = computed(() => (width) => `${props.media.landscape.src}?w=${width}`);
    const initialized = computed(() => root?.value?.classList?.contains('initialized') || false);
    const getSrcset = computed(() => (image) => {
      const isInitialized: boolean = root?.value?.classList?.contains('initialized') || false;
      if (isInitialized && image.src) {
        const srcsetSizes = props.srcset.map((width) => `${image.src}?w=${width} ${width}w`);
        root?.value?.classList?.add('loaded');
        return srcsetSizes.join(',');
      }
    });

    // eslint-disable-next-line
    return { root, getSrcset, getImgBySize };
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
    transition: filter 0.5s ease-in;

    &.top-left {
      @include object-fit(cover, left top);
    }
  }
}
.loaded img {
  filter: none;
}
</style>
