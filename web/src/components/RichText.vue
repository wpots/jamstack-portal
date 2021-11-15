<template>
  <div class="rich-text">
    <h1 v-if="cms.title">{{ cms.title }}</h1>
    <ContentfulRichText :document="cms.body" />
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import ContentfulRichText from './ContentfulRichText.vue';

export default defineComponent({
  name: 'RichText',
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
<style lang="scss" scoped>
.rich-text {
  & div:only-child {
    margin-top: 256px;
  }
}
</style>
