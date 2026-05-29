<template>
  <footer class="program-footer">
    <div class="container-fluid program-footer__inner">
      <!-- <p v-if="credits" class="program-footer__credits">{{ credits }}</p> -->
      <p v-if="copyright" class="program-footer__copyright">{{ copyright }}</p>
      <p class="program-footer__maker">
        Met liefde gemaakt door
        <a href="https://pettico.de" rel="noopener noreferrer" target="_blank">Wieteke</a>
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useProgramTheme } from '@/components/program/programTheme';
import { getProgramPreviewFooter } from '@/content/program-preview-data';

export default defineComponent({
  name: 'ProgramFooter',
  setup() {
    const { themeSlug } = useProgramTheme();
    const footer = computed(() => getProgramPreviewFooter(themeSlug.value));
    const copyright = computed(() => footer.value?.copyright || '');
    const credits = computed(() => footer.value?.credits || '');

    return { copyright, credits };
  },
});
</script>
