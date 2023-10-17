<template>
  <component
    v-for="(contentEntry, index) in content"
    :is="contentEntry.__typename"
    :key="index"
    :id="contentEntry.anchor || contentEntry.__typename + index"
    :cms="contentEntry"
  />
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

const SplashBlock = defineAsyncComponent(() => import("@/components/Partials/SplashBlock.vue"));
const TeaserBlock = defineAsyncComponent(() => import("@/components/Partials/TeaserBlock.vue"));
const QuoteBlock = defineAsyncComponent(() => import("@/components/Partials/QuoteBlock.vue"));
const RepertoirBlock = defineAsyncComponent(() =>
  import("@/components/Partials/RepertoirBlock.vue"),
);


export default defineComponent({
  name: "AppMain",
  props: {
    msg: String,

    content: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SplashBlock,
    TeaserBlock,
    RepertoirBlock,
    QuoteBlock,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
