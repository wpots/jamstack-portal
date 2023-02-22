<template>
  <footer class="site-info row align-items-end justify-content-evenly" v-if="cms">
    <p class="col-xs-12 col-md-6">{{ cms.copyright }}</p>
    <ContentfulRichText :document="cms.credits" class="credits col" />
  </footer>
</template>

<script>
import { defineComponent } from "vue";
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
