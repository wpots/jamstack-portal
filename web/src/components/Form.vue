<template>
  <div>
    {{ cms.forwardEmail }}
  </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Form',

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
