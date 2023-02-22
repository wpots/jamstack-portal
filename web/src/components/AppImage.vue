<template>
  <LazyImage :media="getContentMedia" class="inline-img" />
  <svg xmlns="http://www.w3.org/2000/svg">
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
</template>
<script>
import { defineComponent, computed } from "vue";
import LazyImage from "./LazyImage.vue";

export default defineComponent({
  components: [LazyImage],
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
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

    return { getMedia };
  },
});
</script>
