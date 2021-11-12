<template>
  <footer class="site-info">
    <p>{{ copyright }}</p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppFooter',
  props: {
    copyright: {
      type: String,
      default: '',
    },
  },
});
</script>
