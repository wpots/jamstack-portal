<template>
  <AppIFrame :src="src" name="ticketshop" />
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
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const baseUrl = `https://www.ticketkantoor.nl/shop`;
    const src = computed(() => `${baseUrl}/${props.cms.formId}&embed=1`);
    return { src };
  },
});
</script>
<style lang="sass" scoped>
// TODO move styling here
</style>
