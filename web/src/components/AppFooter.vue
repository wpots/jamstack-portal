<template>
  <footer class="site-info">
    <p>{{ cms.copyright }}</p>
    <VueContentfulRichText :document="cms.credits" />
  </footer>
</template>

<script>
import { defineComponent } from 'vue';
import VueContentfulRichText from '@anivive/vue-contentful-rich-text';

export default defineComponent({
  name: 'AppFooter',
  components: { VueContentfulRichText },
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
