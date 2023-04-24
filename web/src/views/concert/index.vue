<template>
  <AppMain :content="content" />
</template>

<script lang="ts">
import { ref, defineComponent, computed, onErrorCaptured } from "vue";
import { useRoute } from "vue-router";
import { useContent } from "../../composables/useContent";
import AppMain from "../../components/AppMain.vue";

export default defineComponent({
  name: "ConcertPage",
  components: {
    AppMain,
  },
  setup() {
    const error = ref({});
    const contentService = useContent("concert");

    const content = computed(() => contentService.getConcertpage.value);

    onErrorCaptured(e => {
      error.value = e;
      return true;
    });

    return { content, error };
  },
});
</script>
