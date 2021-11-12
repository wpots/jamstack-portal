<template>
  <div class="home">
    <AppHeader :class="headerClass" />
    <main class="sections">
      <SplashBlock @splash-in-view="moveHeader" />
      <AppMain :content="contentEntries" />
    </main>
    <AppFooter :copyright="copyright" />
    <div v-if="error">
      {{ error.value }}
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onErrorCaptured } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import { getHomePage } from './home.graphql';
import AppHeader from '../components/AppHeader.vue';
import AppMain from '../components/AppMain.vue';
import AppFooter from '../components/AppFooter.vue';
import SplashBlock from '../components/SplashBlock.vue';

export default defineComponent({
  name: 'Home',
  components: {
    AppHeader,
    AppMain,
    AppFooter,
    SplashBlock,
  },
  emits: ['splashInView'],
  setup() {
    const error = ref({});
    const headerClass = ref('header--floating');
    const { result, loading } = useQuery(getHomePage, { title: 'Home' });
    const contentEntries = useResult(
      result,
      null,
      (data) => data.homePageCollection.items[0].pageBlocksCollection.items,
    );
    const copyright = useResult(result, null, (data) => data.homePageCollection.items[0].copyright);

    onErrorCaptured((e) => {
      error.value = e;
      return true;
    });

    const moveHeader = (e) => {
      headerClass.value = e.detail === 'up' ? 'header--floating' : null;
    };

    return { loading, contentEntries, copyright, error, moveHeader, headerClass };
  },
});
</script>

<style lang="scss" scoped>
.toTop {
  transform: translateY(0) !important;
}
</style>
