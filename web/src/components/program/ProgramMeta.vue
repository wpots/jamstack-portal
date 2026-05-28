<template>
  <dl class="program-preview__meta">
    <div
      v-for="item in items"
      :key="`${item.term}-${item.description}`"
      class="program-preview__meta-item"
    >
      <dt>{{ item.term }}</dt>
      <dd>{{ item.description }}</dd>
    </div>
  </dl>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface ProgramMetaItem {
  term: string;
  description: string;
}

export default defineComponent({
  name: 'ProgramMeta',
  props: {
    items: {
      type: Array as PropType<ProgramMetaItem[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-preview__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 1rem;
  background: rgba($black, 0.28);
  backdrop-filter: blur(10px);

  dt {
    margin-bottom: 0.25rem;
    color: rgba($white, 0.65);
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    font-size: 1rem;
  }
}
</style>
