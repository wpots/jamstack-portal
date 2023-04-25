<template>
  <div class="iframe">
    <iframe :src="src" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppIframe",
  props: {
    src: String,
    parameters: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
});
</script>
<style lang="scss" scoped>
iframe {
  width: 100%;
  max-width: 600px;
  min-height: 950px;
  overflow-y: auto;
  border: 0;
}
</style>
