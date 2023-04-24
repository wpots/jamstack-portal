<template>
  <AppIFrame
    :src="src"
    name="ticketshop"
    style="width: 100%; max-width: 600px; min-height: 950px; overflow-y: auto; border: 0"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import AppIFrame from "../AppIFrame.vue";

export default defineComponent({
  name: "EmbeddedTicketForm",
  components: {
    AppIFrame,
  },
  props: {
    formId: String,
  },
  setup(props) {
    const baseUrl = `https://www.ticketkantoor.nl/shop`;
    const src = computed(() => `${baseUrl}/${props.formId}&embed=1`);
    return { src };
  },
});
</script>
<style lang="sass" scoped>
// TODO move styling here
</style>
