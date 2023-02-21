<template>
  <aside class="meta-info">
    <a
      href="https://www.instagram.com/vocalgroup_goedgebekt/"
      class="link--icon icon-instagram"
      target="_blank"
      rel="nofollow"
    >
      <svg><use href="#icon-instagram"></use></svg>
      <span class="sr-only">volg ons via instagram</span></a
    >
    <a
      href="https://www.youtube.com/@goedgebektvocalgroup7479"
      class="link--icon icon-youtube"
      target="_blank"
      rel="nofollow"
    >
      <svg><use href="#icon-youtube"></use></svg>
      <span class="sr-only">subscribe op onze youtube channel</span></a
    >
    <a
      href="https://www.facebook.com/GoedGebekt/"
      class="link--icon icon-facebook"
      target="_blank"
      rel="nofollow"
    >
      <svg><use href="#icon-facebook"></use></svg>
      <span class="sr-only">blijf op de hoogte via facebook</span></a
    >
  </aside>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StickyWidget',
});
</script>
<style lang="scss" scoped>
.meta-info {
  position: fixed;
  right: 20px;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: white;
  z-index: 2;
}

.link--icon {
  margin-bottom: 0.5rem;
  color: $white;

  svg {
    fill: currentColor;
    width: 25px;
    height: 25px;
  }
}
.icon-facebook {
  --icon-bg-color: #2851a3;
}
.icon-youtube {
  --icon-bg-color: #c00;
}
</style>
