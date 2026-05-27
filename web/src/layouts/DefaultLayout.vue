<template>
  <div id="top">
    <AppHeader />
    <main class="sections">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
    <AppFooter />
    <StickyWidget />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import StickyWidget from '@/components/StickyWidget.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    AppHeader,
    AppFooter,
    StickyWidget,
  },
});
</script>
