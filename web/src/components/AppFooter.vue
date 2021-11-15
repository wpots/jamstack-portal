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
  justify-content: space-evenly;
}
</style>
