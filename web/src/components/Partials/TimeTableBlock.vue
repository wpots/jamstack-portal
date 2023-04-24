<template>
  <section class="section timetableblock">
    <div v-if="error">
      {{ error.value }}
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <ContentfulRichText :document="cmd.introduction" />
        </div>
        <div class="col-12 soundwave">
          <SetList v-if="firstSetlist?.length > 0" :set="cms.firstSetlist" />
          <p class="font--fancy">PAUZE</p>
          <SetList v-if="lastSetlist?.length > 0" :set="cms.lastSetlist" class="lower" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import SetList from "../SetList.vue";
import ContentfulRichText from "../ContentfulRichText.vue";

// https://next--vue-dataset-demo.netlify.app/components/#props
export default defineComponent({
  name: "TimeTableBlock",
  components: { SetList, ContentfulRichText },
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
<style lang="scss" scoped>
.section {
  margin-top: -70px;
}
.soundwave {
  display: flex;
  flex-flow: row nowrap;
  padding-top: 2rem;
  padding-bottom: 100%;
  overflow-y: initial;
  overflow-x: scroll;
}
</style>
