<template>

  <div>
        <div v-if="formSelection" class="row selection">
        <p>Selecteer een voorstelling:</p>
        <div v-for="(form, index) in formSelection" class="col selection__item" :key="index">
          <input
            type="radio"
            :name="form.id"
            :value="form.id"
            :id="form.id"
            v-model="isSelected"
          />
          <label
            :for="form.id"
            class="btn--default"
            :class="{ primary: form.id === isSelected }"
            >{{ form.id }}</label
          >
        </div>
      </div>
      <div v-if="forms" class="row">
        <KeepAlive>
          <div v-for="(form, i) in forms" :key="i" class="col-12">
          <AppIFrame v-if="form.id === isSelected" :src="form.src" name="ticketshop" class="ticketform"/>
          </div>
        </KeepAlive>
      </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, computed,ref,watch, PropType } from "vue";
import AppIFrame from "./AppIFrame.vue";

type ContentfulJsonObject = {
  id:string;
  key:string;
  value:string;
}

export default defineComponent({
  name: "EmbeddedTicketForms",
  components: {
    AppIFrame,
  },
  props: {
    cms: {
      type: Array as PropType<ContentfulJsonObject[]>,
      default: () =>([ ]),
    },
  },
  setup(props) {
    const baseUrl = `https://www.ticketkantoor.nl/shop`;

    const isSelected = ref('');
    const forms = computed(() => props.cms.map((form) => ({id:form.id,title:form.key ,src:`${baseUrl}/${form.value}&embed=1`})));
    const formSelection = computed(() => 
       forms.value?.length >= 2 ? forms.value : false
    );
    // @ts-ignore
    watch(formSelection, () => (isSelected.value = forms.value?.[0]?.id)); // is this right?

    return { forms, formSelection, isSelected };
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/common/variables" as *;
@use "@/assets/styles/common/mixins" as *;
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
</style>
