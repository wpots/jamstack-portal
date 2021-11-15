<template>
  <footer class="site-info" v-if="cms">
    <p>{{ cms.copyright }}</p>
    <ContentfulRichText :document="cms.credits" class="credits" />
  </footer>
</template>

<script>
import { defineComponent } from 'vue';
import ContentfulRichText from './ContentfulRichText.vue';

export default defineComponent({
  name: 'AppFooter',
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
  width: 100%;
  color: var(--bs-gray-700);
  font-size: 0.8em;
  min-height: 10vh;
  background-color: var(--bs-gray-400);
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  position: relative;
  z-index: 1;

  a {
    color: currentColor;
  }
}
</style>
