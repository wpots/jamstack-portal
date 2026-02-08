<template>
  <div class="container">
    <div class="row">
      <KeepAlive>
        <AppMain :content="content" />
      </KeepAlive>
    </div>
  </div>
</template>

<script lang="ts">
import {  defineComponent, computed } from "vue";
import { useContent } from "../../composables/useContent";
import AppMain from "../../components/AppMain.vue";

export default defineComponent({
  name: "ConcertPage",
  components: {
    AppMain,
  },

  setup() {
    const contentService = useContent("concert");
    const content = computed(() => contentService.getConcertpage.value);


    return { content  };
  },
});
</script>
<style lang="scss" scoped>
@use "@/assets/styles/common/variables" as *;
@use "@/assets/styles/common/mixins" as *;

.section .row {
  padding: 0;
}
</style>
