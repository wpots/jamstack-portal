<template>
  <figure
    role="presentation"
    ref="root"
    v-lazyload="{ callback: setSrcset }"
    class
    :class="loaded ? 'loaded' : false"
  >
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
        loading="lazy"
        :srcset="getSrcset"
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
    const landscape = ref<HTMLImageElement | null>(null);
    const loaded = ref(false);
    const getImgBySize = computed(
      () => (width: number) => `${props.media.landscape.src}?w=${width}`,
    );
    const getSrcset = computed(() => {
      if (loaded.value && props.media.landscape.src) {
        const srcsetSizes = props.srcset.map(
          (width) => `${props.media.landscape.src}?w=${width} ${width}w`,
        );
        return srcsetSizes.join(',');
      }
      return '';
    });

    const setSrcset = () => {
      loaded.value = true;
    };

    // eslint-disable-next-line
    return { root, getSrcset, getImgBySize, setSrcset, landscape, loaded };
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
    &.contain-center {
      @include object-fit(contain, center);
    }
  }
}
.loaded img {
  filter: none;
}
</style>
