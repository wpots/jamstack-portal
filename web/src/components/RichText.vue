<template>
  <div class="rich-text">
    <h1 v-if="cms.title">{{ cms.title }}</h1>
    <ContentfulRichText :document="cms.body" />
    <EmbeddedTicketForms v-if="embeddedForms" :cms="embeddedForms" />
    <YouTubeVideo v-if="embeddedVideo" :videoId="embeddedVideo"/>
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
    const embeddedVideo = computed(() => props.cms.embeddedYouTubeId ? props.cms.embeddedYouTubeId : false);
    const embeddedForms = computed(() => props.cms.ticketForm?.length > 0 ? props.cms.ticketForm :false);
    return {embeddedForms, embeddedVideo}
  }
});
</script>
<style lang="scss" scoped>
@use "@/assets/styles/common/variables" as *;
@use "@/assets/styles/common/mixins" as *;
.rich-text {
  &.drop div:only-child {
    margin-top: 256px;
  }
}
</style>
