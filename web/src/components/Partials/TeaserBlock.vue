<template>
  <div class="section teaserblock">
    <LazyImage v-if="getMedia" class="bg-img teaserblock__bg" :media="getMedia" :sticky="true" />
    <div class="container-fluid">
      <article class="row">
        <div
          class="col-xs-12 col-sm-6"
          v-for="(item, index) in cms.columnContentCollection.items"
          :key="index"
        >
          <component :is="item.__typename" :key="index" :cms="item" />
        </div>
      </article>
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, defineAsyncComponent } from "vue";
import LazyImage from "../LazyImage.vue";
const ContentTypeRichText = defineAsyncComponent(() => import("@/components/RichText.vue"));
const Image = defineAsyncComponent(() => import("@/components/AppImage.vue"));
const YouTubeVideo = defineAsyncComponent(() => import("@/components/YouTubeVideo.vue"));
const Form = defineAsyncComponent(() => import("@/components/AppForm.vue"));
const EventList = defineAsyncComponent(() => import("@/components/EventList.vue"));

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { LazyImage, ContentTypeRichText, Image, YouTubeVideo, Form, EventList },
  name: "TeaserBlock",
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const getMedia = computed(() => {
      if (props.cms.backgroundImage) {
        const landscape = {
          src: props.cms.backgroundImage.url,
          alt: props.cms.backgroundImage.title,
        };
        return { landscape };
      }
      return false;
    });

    return { getMedia };
  },
});
</script>
<style lang="scss">
.teaserblock {
  .row {
    align-items: end;
  }
}
</style>
