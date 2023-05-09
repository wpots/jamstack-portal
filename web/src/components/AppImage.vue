<template>
  <div class="img__frame">
    <LazyImage
      v-if="getMedia"
      :media="getMedia"
      :srcset="getSizes"
      class="inline-img"
      :class="classList"
    />
    <svg xmlns="http://www.w3.org/2000/svg" v-if="hasBubbleEffect">
      <circle
        cx="43%"
        cy="42%"
        r="36%"
        fill="#EB008B"
        data-animate="rotateIn"
        class=""
        style="opacity: 1"
      ></circle>
      <circle
        cx="58%"
        cy="41%"
        r="33%"
        fill="#fe265e"
        data-animate="rotateIn"
        class=""
        style="opacity: 1"
      ></circle>
      <circle
        cx="45%"
        cy="60%"
        r="34%"
        fill="#3beca8"
        data-animate="rotateIn"
        class=""
        style="opacity: 1"
      ></circle>
      <circle
        cx="58%"
        cy="60%"
        r="32%"
        fill="#a9f946"
        data-animate="rotateIn"
        class=""
        style="opacity: 1"
      ></circle>
    </svg>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import LazyImage from "./LazyImage.vue";

export default defineComponent({
  components: { LazyImage },
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const hasBubbleEffect = computed(() => props.cms.imageEffects === "Bubbles");
    const getSizes = computed(() => (hasBubbleEffect.value ? [582] : null));
    const classList = computed(() => {
      let classes = "";
      if (props.cms.classes) classes += props.cms.classes;
      if (props.cms.imageRatio === "Round") classes += "rounded";
      return classes;
    });
    const getMedia = computed(() => {
      if (props.cms.image) {
        const landscape = {
          src: props.cms.image.url,
          alt: props.cms.image.title,
        };

        return { landscape };
      }
      return false;
    });

    return { getMedia, getSizes, hasBubbleEffect, classList };
  },
});
</script>
