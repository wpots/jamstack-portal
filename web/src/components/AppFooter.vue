<template>
  <footer class="site-info row align-items-end justify-content-evenly" v-if="cms">
    <p class="col-xs-12 col-md-6">{{ copyright }}</p>
    <ContentfulRichText :document="credits" class="credits col" />
  </footer>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useContent } from "../composables/useContent";
import ContentfulRichText from "./ContentfulRichText.vue";

export default defineComponent({
  name: "AppFooter",
  components: { ContentfulRichText },
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    const { getFooter } = useContent();
    const copyright = computed(() => getFooter.value?.copyright);
    const credits = computed(() => getFooter.value?.credits);
    return { copyright, credits };
  },
});
</script>
<style lang="scss">
.site-info {
  margin: 0 !important;
  padding: 1rem;
  color: var(--bs-gray-700);
  font-size: 0.8em;
  min-height: 10vh;
  background-color: var(--bs-gray-400);
  position: relative;
  z-index: 1;

  a {
    color: currentColor;
  }
}
</style>
