<template>
  <div class="home">
    <AppHeader />
    <main class="sections">
      <AppMain />
    </main>
    <AppFooter />
    <div v-if="error">
      {{ error.value }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onErrorCaptured } from 'vue';

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
    onErrorCaptured((e) => {
      error.value = e;
      return true;
    });
    const contentEntries = false;
    const loading = false;
    return { loading, contentEntries, error };
  },
});
</script>
