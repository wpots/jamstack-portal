<template>
  <component v-for="(component, index) in contentBlocks" :is="component.template" :key="index" />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import testQuery from '@/apollo/queries/testQuery';

const SplashBlock = defineAsyncComponent(() => import('@/components/SplashBlock.vue'));
const TeaserBlock = defineAsyncComponent(() => import('@/components/TeaserBlock.vue'));
const QuoteBlock = defineAsyncComponent(() => import('@/components/QuoteBlock.vue'));
const FormBlock = defineAsyncComponent(() => import('@/components/FormBlock.vue'));
const RepertoirBlock = defineAsyncComponent(() => import('@/components/RepertoirBlock.vue'));

export default defineComponent({
  name: 'AppMain',
  props: {
    msg: String,
    contentBlocks: {
      type: Array,
      default: () => [
        { template: SplashBlock },
        { template: TeaserBlock },
        { template: RepertoirBlock },
        { template: QuoteBlock },
        // { template: FormBlock },
        // { template: FormBlock },
      ],
    },
  },
  components: {
    SplashBlock,
    TeaserBlock,
    RepertoirBlock,
    QuoteBlock,
    FormBlock,
  },
  setup() {
    const { result, loading } = useQuery(testQuery);
    const members = useResult(result, null, (data) => data.memberCollection.items);
    return { loading, members };
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
