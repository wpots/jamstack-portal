<template>
  <nav class="nav--split nav--toggle d-flex align-items-center">
    <div class="col-auto">
      <router-link :to="{ path: '/', hash: '#top' }" class="brand">
        <AppLogo />
      </router-link>
    </div>
    <div class="col-auto">
      <button
        @click="showMenu = !showMenu"
        type="button"
        class="btn btn--square btn--hamburger-cross nav__btn--mobile"
        :class="showMenu ? 'focus' : null"
      >
        <span>toggle menu</span>
      </button>
      <ul class="toggle-menu" :class="showMenu ? 'focus' : null">
        <li class="menu-item" v-for="(item, index) in cms" :key="index">
          <router-link :to="routerLocation(item)" @click="showMenu = !showMenu">{{
            item.title
          }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { defineComponent, ref } from 'vue';
import AppLogo from '@/components/AppLogo.vue';

export default defineComponent({
  name: 'AppNavigation',
  components: {
    AppLogo,
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
    const showMenu = ref(false);
    const routerLocation = item => {
      return {
        path: item.link || '/',
        hash: item.anchor ? `#${item.anchor}` : false,
      };
    };
    return { showMenu, routerLocation };
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
.nav--split {
  gap: 1rem;
  justify-content: space-between;
}
</style>
