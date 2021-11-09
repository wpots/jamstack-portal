<template>
  <div class="home">
    <AppHeader :class="headerClass" />
    <main class="sections">
      <SplashBlock @splash-in-view="moveHeader" />
      <AppMain />
    </main>
    <AppFooter />
    <div v-if="error">
      {{ error.value }}
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onErrorCaptured } from 'vue';

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

    onErrorCaptured((e) => {
      error.value = e;
      return true;
    });

    const moveHeader = (e) => {
      headerClass.value = e.detail === 'up' ? 'header--floating' : null;
    };

    const contentEntries = false;
    const loading = false;
    return { loading, contentEntries, error, moveHeader, headerClass };
  },
});
</script>

<style lang="scss" scoped>
.toTop {
  transform: translateY(0) !important;
}
</style>
