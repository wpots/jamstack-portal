<template>
  <div class="home">
    <AppHeader />
    <main class="sections">
      <AppMain />
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppHeader from '@/components/AppHeader.vue';
import AppMain from '@/components/AppMain.vue';
import AppFooter from '@/components/AppFooter.vue';

export default defineComponent({
  name: 'Home',
  components: {
    AppHeader,
    AppMain,
    AppFooter,
  },
  setup() {
    const contentEntries = false;
    const loading = false;
    // const {loading, result} = useQuery(homepageQuery);
    // const contentEntries = useResult(result, null, (data) => data.items)
    return { loading, contentEntries };
  },
});
</script>
