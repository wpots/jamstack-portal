<template>
  <header class="header" ref="root">
    <div class="banner container">
      <nav class="nav--split nav--toggle" data-focus-parent="toggle-mob-nav">
        <button
          type="button"
          class="btn btn--square btn--pink btn--hamburger-cross"
          data-focus="toggle-mob-nav"
          data-target="toggle-menu-info"
        >
          <span>toggle menu</span>
        </button>
        <button
          type="button"
          class="btn btn--square btn--pink btn--phone"
          data-focus="toggle-mob-nav"
          data-target="toggle-menu-contact"
        >
          <span class="sr-only">toggle menu</span>
          <span class="icon-phone"></span>
        </button>
        <ul id="toggle-menu-info">
          <li class="menu-item menu-het-koor">
            <a href="#het-koor" data-target="toggle-182" data-scroll="1">Het Koor</a>
          </li>
          <li class="menu-item menu-repertoire">
            <a href="#het-repertoire" data-target="toggle-183" data-scroll="1">repertoire</a>
          </li>
        </ul>

        <a class="brand" data-scroll href="#het-koor">
          <Logo />
        </a>
        <ul id="toggle-menu-contact">
          <li class="menu-item menu-boek-ons">
            <a href="#boek-ons" data-target="toggle-184" data-scroll="1">boek ons</a>
          </li>
          <li class="menu-item menu-word-lid">
            <a href="#word-lid" data-target="toggle-185" data-scroll="1">word lid</a>
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
  setup() {
    const root = ref(null);
    return { root };
  },
});
</script>
