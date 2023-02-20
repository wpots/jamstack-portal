<template>
  <header class="header" ref="root">
    <div class="banner container-fluid">
      <div class="row">
        <AppNavigation class="col-xs-12" v-if="cms && cms.nav" :cms="cms.nav" />
        <div class="col-auto ml-auto">
          <CallToAction v-if="cms && cms.cta" :cms="cms.cta" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue';
import AppNavigation from '@/components/AppNavigation.vue';
import CallToAction from '@/components/CallToAction.vue';

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
