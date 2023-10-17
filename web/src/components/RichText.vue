<template>
  <div class="rich-text">
    <h1 v-if="cms.title">{{ cms.title }}</h1>
    <ContentfulRichText :document="cms.body" />

    <YouTubeVideo v-if="embeddedVideo" :videoId="embeddedVideo"/>
    <EmbeddedTicketForms v-if="embeddedForms" :ids="embeddedForms" />
  </div>
</template>
<script>
import { defineComponent, defineAsyncComponent, computed } from 'vue';
import ContentfulRichText from './ContentfulRichText.vue';
const YouTubeVideo = defineAsyncComponent(() => import("@/components/YouTubeVideo.vue"));
const EmbeddedTicketForms = defineAsyncComponent(() =>
  import("@/components/EmbeddedTicketForms.vue"),
);

export default defineComponent({
  name: 'RichText',
  components: { ContentfulRichText , EmbeddedTicketForms , YouTubeVideo},
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const embeddedVideo = computed(() => props.cms.embeddedContent === 'YouTube' && props.cms.embeddedYouTubeId ? props.cms.embeddedYouTubeId : false);
    const embeddedForms = computed(() => { 
      const hasforms = props.cms.embeddedContent === 'Ticket Form' && props.cms.embeddedTicketForm;
      if(hasforms) {
        return props.cms.embeddedTicketForm.split(';');
      }
      return false
     });
return {embeddedForms, embeddedVideo}
  }
});
</script>
<style lang="scss" scoped>
.rich-text {
  &.drop div:only-child {
    margin-top: 256px;
  }
}
</style>
