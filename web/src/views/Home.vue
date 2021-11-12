<template>
  <div class="home">
    <AppHeader />
    <main class="sections">
      <AppMain :content="contentEntries" />
    </main>
    <div class="spacer"></div>
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

export default defineComponent({
  name: 'Home',
  components: {
    AppHeader,
    AppMain,
    AppFooter,
  },

  setup() {
    const error = ref({});
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

    return { loading, contentEntries, copyright, error };
  },
});
</script>
