<template>
  <div class="container">
    <div class="row">
      <KeepAlive>
        <AppMain :content="contentBlocks" />
      </KeepAlive>
    </div>
    <div v-if="formSelection" class="row selection">
      <p>Selecteer een voorstelling:</p>
      <div v-for="(form, index) in formSelection" class="col selection__item" :key="index">
        <input
          type="radio"
          :name="form.formId"
          :value="form.formId"
          :id="form.formId"
          v-model="isSelected"
        />
        <label
          :for="form.formId"
          class="btn--default"
          :class="{ primary: form.formId === isSelected }"
          >{{ form.formTitle }}</label
        >
      </div>
    </div>
    <div v-if="ticketForms" class="row">
      <KeepAlive>
        <div v-for="(form, i) in ticketForms" :key="i" class="col-12">
          <EmbeddedTicketForm v-if="form.formId === isSelected" :cms="form" class="ticketform" />
        </div>
      </KeepAlive>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, watch } from "vue";
import { useContent } from "../../composables/useContent";
import AppMain from "../../components/AppMain.vue";
import EmbeddedTicketForm from "../../components/Partials/EmbeddedTicketForm.vue";

export default defineComponent({
  name: "ConcertPage",
  components: {
    AppMain,
    EmbeddedTicketForm,
  },

  setup() {
    const isSelected = ref({});

    const contentService = useContent("concert");
    const content = computed(() => contentService.getConcertpage.value);
    const ticketForms = computed(() => content?.value?.filter(c => c.formId));
    const contentBlocks = computed(() => content?.value?.filter(c => !c.formId));
    const formSelection = computed(() =>
      ticketForms?.value?.length >= 2 ? ticketForms.value : false,
    );

    watch(formSelection, () => (isSelected.value = ticketForms.value?.[0].formId));

    return { content, contentBlocks, ticketForms, formSelection, isSelected };
  },
});
</script>
<style lang="scss" scoped>
.selection {
  display: flex;
  margin-right: auto;
  margin-bottom: 2rem;
  margin-left: auto;
  max-width: 600px;

  input {
    appearance: none;
  }
}
.ticketform {
  max-width: 600px;
  padding: 1rem;
  margin-right: auto;
  margin-left: auto;
  border: 1px solid $theme-color-disabled;
}
.section .row {
  padding: 0;
}
</style>
