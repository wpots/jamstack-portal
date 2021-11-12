<template>
  <div class="rich-text">
    <h1 v-if="cms.title">{{ cms.title }}</h1>
    <VueContentfulRichText :document="cms.body" />
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import VueContentfulRichText from '@anivive/vue-contentful-rich-text';

export default defineComponent({
  name: 'RichText',
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
<style lang="scss" scoped>
.rich-text {
  & div:only-child {
    margin-top: 256px;
  }
}
</style>
