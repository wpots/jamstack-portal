<template>
  <router-link v-if="route.path" class="btn--primary call-to-action" :to="route">
    <svg v-if="getIconName"><use :href="getIconName"></use></svg>
    <span class="">{{ cms.linkText }}</span>
  </router-link>
</template>
<script>
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "CallToAction",
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

    const route = computed(() => {
      if (getPageAnchor.value || props.cms.path) {
        return {
          path: getPageAnchor.value ? "/" : props.cms.path,
          hash: getPageAnchor.value,
        };
      } else {
        return false;
      }
    });
    return { getIconName, getPageAnchor, route };
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
