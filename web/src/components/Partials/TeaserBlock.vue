<template>
  <div class="section teaserblock">
    <LazyImage v-if="getMedia" class="bg-img teaserblock__bg" :media="getMedia" :sticky="true" />
    <div class="container-fluid">
      <article class="flex-box row" id="content-het-koor">
        <div
          class="col-sm-6"
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
import { computed, defineComponent, defineAsyncComponent } from 'vue';
import LazyImage from '../LazyImage.vue';
const ContentTypeRichText = defineAsyncComponent(() => import('@/components/RichText.vue'));
const Image = defineAsyncComponent(() => import('@/components/Image.vue'));
const YouTubeVideo = defineAsyncComponent(() => import('@/components/YouTubeVideo.vue'));
const Form = defineAsyncComponent(() => import('@/components/Form.vue'));

export default defineComponent({
  components: { LazyImage, ContentTypeRichText, Image, YouTubeVideo, Form },
  name: 'TeaserBlock',
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
