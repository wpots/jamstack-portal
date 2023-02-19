<template>
  <header class="header" ref="root">
    <div class="banner container">
      <nav class="nav--split nav--toggle">
        <a class="brand" href="#top">
          <Logo />
        </a>
        <button
          @click="showMenu = !showMenu"
          type="button"
          class="btn btn--square btn--hamburger-cross"
          :class="showMenu ? 'focus' : null"
        >
          <span>toggle menu</span>
        </button>
        <ul class="toggle-menu" :class="showMenu ? 'focus' : null">
          <li class="menu-item" v-for="(item, index) in cms" :key="index">
            <a :href="`#${item.anchor}`" @click="showMenu = !showMenu">{{ item.title }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Logo from '@/components/Logo.vue';

export default defineComponent({
  name: 'AppHeader',
  components: {
    Logo,
  },
  props: {
    cms: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    const showMenu = ref(false);

    return { showMenu };
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
</style>
