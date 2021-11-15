<template>
  <div v-html="content"></div>
</template>
<script>
import { computed, defineComponent } from 'vue';
// import { BLOCKS } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
export default defineComponent({
  name: 'ContentfulRichText',
  props: {
    document: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    // https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer
    const content = computed(() => documentToHtmlString(props.document.json));
    return { content };
  },
});
</script>
