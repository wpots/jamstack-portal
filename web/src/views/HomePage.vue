<template>
  <KeepAlive>
    <AppMain :content="content" />
  </KeepAlive>
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
    console.log(content.value);
    return { content };
  },
});
</script>
