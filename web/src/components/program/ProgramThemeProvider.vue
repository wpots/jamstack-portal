<template>
  <component :is="tag" :class="['program-theme', themeClass]">
    <slot />
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, provide } from 'vue';
import { createProgramThemeClass, PROGRAM_THEME_CONTEXT } from '@/components/program/programTheme';

export default defineComponent({
  name: 'ProgramThemeProvider',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    themeSlug: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const themeSlug = computed(() => props.themeSlug);
    const themeClass = computed(() => createProgramThemeClass(themeSlug.value));

    provide(PROGRAM_THEME_CONTEXT, {
      themeSlug,
      themeClass,
      isTheme: (candidateThemeSlug: string) => themeSlug.value === candidateThemeSlug,
    });

    return {
      themeClass,
    };
  },
});
</script>
