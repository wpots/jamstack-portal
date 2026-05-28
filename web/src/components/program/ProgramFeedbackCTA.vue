<template>
  <div class="program-preview__feedback-bar">
    <p>{{ message }}</p>
    <button type="button" @click="$emit('click')">{{ buttonLabel }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProgramFeedbackCTA',
  emits: ['click'],
  props: {
    message: {
      type: String,
      default: 'Na deze set: snelle vote + open feedback blijft beschikbaar.',
    },
    buttonLabel: {
      type: String,
      default: 'Geef je mening',
    },
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;

.program-preview__feedback-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: rgba($white, 0.82);
  box-shadow: 0 12px 24px rgba($black, 0.05);

  p {
    margin: 0;
    font-size: 0.9rem;
  }

  button {
    padding: 0.7rem 1rem;
    border: 0;
    border-radius: 999px;
    background: var(--program-color-accent);
    color: $white;
    font-family: var(--program-font-display);
    font-size: 0.75rem;
    white-space: nowrap;
  }
}

@media (max-width: 900px) {
  .program-preview__feedback-bar {
    position: sticky;
    bottom: 1rem;
    z-index: 10;
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
    }
  }
}
</style>
