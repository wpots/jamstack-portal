<template>
  <a v-if="getPageAnchor" class="btn--primary call-to-action" :href="getPageAnchor">
    <svg v-if="getIconName"><use :href="getIconName"></use></svg>
    <span class="">{{ cms.linkText }}</span>
  </a>
</template>
<script>
import { defineComponent, computed } from 'vue';
export default defineComponent({
  name: 'CallToAction',
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const getIconName = computed(() => {
      return props.cms.iconName ? `#icon-${props.cms.iconName}` : false;
    });
    const getPageAnchor = computed(() => {
      return props.cms.inPageAnchor?.anchor ? `#${props.cms.inPageAnchor.anchor}` : false;
    });
    return { getIconName, getPageAnchor };
  },
});
</script>
<style lang="scss" scoped>
svg {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
}
</style>
