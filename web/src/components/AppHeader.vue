<template>
  <header class="header" ref="root">
    <div class="banner container-fluid">
      <div class="row">
        <AppNavigation class="col-xs-12" :cms="nav" />
        <div class="col-auto ml-auto">
          <CallToAction v-if="showCta" :cms="cta" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent, computed } from 'vue';
import AppNavigation from '@/components/AppNavigation.vue';
import CallToAction from '@/components/CallToAction.vue';
import { useContent } from '../composables/useContent';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'AppHeader',
  components: {
    AppNavigation,
    CallToAction,
  },
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    const { getHeader } = useContent();
    const route = useRoute();
    const nav = computed(() => getHeader.value?.nav);
    const cta = computed(() => getHeader.value?.cta);
    const excludePages = ['programma', 'feedback'];
    const showCta = computed(() => {
      return !excludePages.includes(route.name);
    });
    return { nav, cta, showCta };
  },
});
</script>
<style lang="scss" scoped>
.menu-item:not(:first-child) {
  @include media-breakpoint-up(sm) {
    ::before {
      content: '/';
      margin-right: 0.5rem;
    }
  }
}
.ml-auto {
  margin-left: auto;
}
</style>
