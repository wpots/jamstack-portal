<template>
  <aside v-if="stats.length" class="program-stats-cloud" aria-label="Programma statistieken">
    <ul class="program-stats-cloud__list">
      <li v-for="stat in stats" :key="stat.label" class="program-stats-cloud__item">
        <span class="program-stats-cloud__label">{{ stat.label }}</span>
        <span class="program-stats-cloud__count">({{ stat.value }})</span>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import type { ProgramItem, ProgramSetItem } from '@/composables/useContent/program.types';

interface ProgramStat {
  label: string;
  value: number;
}

function isProgramSetItem(item: ProgramItem): item is ProgramSetItem {
  return item.type === 'set';
}

export default defineComponent({
  name: 'ProgramStatsCloud',
  props: {
    programItems: {
      type: Array as PropType<ProgramItem[]>,
      default: () => [],
    },
  },
  setup(props) {
    const stats = computed<ProgramStat[]>(() => {
      const sets = props.programItems.filter(isProgramSetItem);
      const songCount = sets.reduce((total, set) => total + set.songs.length, 0);
      const setCount = sets.length;
      const ensembleTitles = sets
        .map((set) => set.title?.trim())
        .filter((title): title is string => Boolean(title));
      const ensembleCount = new Set(ensembleTitles).size || setCount;

      return [
        { label: 'Nummers', value: songCount },
        { label: 'Sets', value: setCount },
        { label: 'Ensembles', value: ensembleCount },
      ].filter((stat) => stat.value > 0);
    });

    return { stats };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as vars;

.program-stats-cloud {
  position: relative;
  z-index: 3;
  margin-top: -4rem;
  padding: 0 1rem 1rem;
}

.program-stats-cloud__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  justify-content: center;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.program-stats-cloud__item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  margin: 0.2rem;
  padding: 0.45em 1.05em;
  border-radius: 999px;
  color: vars.$white;
  font-family: var(--program-font-display, #{vars.$font-fam-heading});
  font-size: clamp(1.35rem, 2.8vw, 2.45rem);
  line-height: 0.95;
  text-transform: uppercase;
  text-shadow: 1px 1px 3px rgba(vars.$black, 0.2);
  white-space: nowrap;
  mix-blend-mode: multiply;
  box-shadow: 0 14px 28px rgba(vars.$black, 0.12);

  &:nth-child(3n + 1) {
    background: var(--program-color-accent, #{vars.$magenta});
  }

  &:nth-child(3n + 2) {
    background: #fe265e;
  }

  &:nth-child(3n) {
    background: #3beca8;
  }

  &:nth-child(4n) {
    background: #a9f946;
  }

  &:nth-child(2) {
    transform: translateY(0.9rem);
  }

  &:nth-child(3) {
    transform: translateY(-0.2rem);
  }
}

.program-stats-cloud__label {
  letter-spacing: 0.03em;
}

.program-stats-cloud__count {
  font-size: 0.7em;
  opacity: 0.95;
}

@media (max-width: 767px) {
  .program-stats-cloud {
    margin-top: -3rem;
    padding: 0 0.75rem 0.75rem;
  }

  .program-stats-cloud__list {
    justify-content: flex-start;
  }

  .program-stats-cloud__item {
    font-size: clamp(1.15rem, 6vw, 1.8rem);

    &:nth-child(2),
    &:nth-child(3) {
      transform: none;
    }
  }
}
</style>
