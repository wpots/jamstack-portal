<template>
  <StickyWidget />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StickyWidget from '@/components/StickyWidget.vue';

export default defineComponent({
  name: 'AppFooter',
  components: {
    StickyWidget,
  },
});
</script>
