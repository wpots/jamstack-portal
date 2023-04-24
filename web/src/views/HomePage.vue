<template>
  <AppMain :content="content" />
</template>

<script>
import { computed, defineComponent } from "vue";
import { useContent } from "../composables/useContent";
import AppMain from "../components/AppMain.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    AppMain,
  },

  setup() {
    const contentService = useContent("home");
    const content = computed(() => contentService.getHomepage.value);

    return { content };
  },
});
</script>
