<template>
  <figure
    role="presentation"
    ref="root"
    v-lazyload="{ ...lazySettings, callback: setSrcset }"
    :style="{ position: sticky ? 'sticky' : undefined }"
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
      <source
        ref="landscape"
        :class="media.classes"
        :sizes="media.landscape.sizes"
        loading="lazy"
        :srcset="getSrcset"
        :alt="media.landscape.alt"
      />

      <img
        :class="media.classes"
        :sizes="media.landscape.sizes"
        :src="getImgBySize(20)"
        :alt="media.landscape.alt"
        :id="id"
      />
    </picture>
  </figure>
</template>
<script lang="ts">
// eslint-disable-next-line
import { ref, defineComponent, PropType, computed, nextTick, watchEffect } from 'vue';

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
        landscape: {
          src: "",
          sizes: "",
          alt: "",
        },
        portrait: undefined,
        classes: "",
      };

export default defineComponent({
  name: 'LazyImage',
  props: {
    sticky: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: 'image',
    },
    lazySettings: {
      type: Object || Boolean,
      default: () => {
        return {
          settings: {
            threshold: 0.1,
          },
          persist: false,
        };
      },
    },
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
      let srcsetSizes;
      if (loaded.value && props.media.landscape.src) {
        srcsetSizes = props.srcset.map(
          width => `${props.media.landscape.src}?w=${width} ${width}w`,
        );
        srcsetSizes.join(',');
      }
      return srcsetSizes;
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
.n00b {
  display: none;
}
</style>
