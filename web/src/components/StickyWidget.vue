<template>
  <aside class="meta-info">
    <a href="https://www.facebook.com/GoedGebekt/" class="link--icon icon-facebook" target="_blank"
      ><span class="sr-only">volg ons via facebook</span></a
    >
  </aside>
</template>
<script>
// Sticky section
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StickyWidget',
});
</script>
<style lang="scss" scoped>
.meta-info {
  position: fixed;
  right: 20px;
  bottom: 20px;
  color: white;
  z-index: 2;
}
</style>
