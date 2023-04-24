<template>
  <div class="iframe">
    <iframe
      src="https://www.ticketkantoor.nl/shop/goed-geconcert-1&embed=1"
      name="ticketshop"
      style="width: 100%; max-width: 600px; min-height: 950px; overflow-y: auto; border: 0"
    ></iframe>
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
