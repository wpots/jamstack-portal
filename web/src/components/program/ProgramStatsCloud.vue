<template>
  <aside v-if="stats.length" class="program-stats-cloud" aria-label="Programma statistieken">
    <ul class="program-stats-cloud__list">
      <li
        v-for="stat in stats"
        :key="stat.label"
        class="program-stats-cloud__item"
        :style="stat.style"
      >
        <span class="program-stats-cloud__pill">
          <span class="program-stats-cloud__value">{{ stat.value }}</span>
          <span class="program-stats-cloud__label">{{ stat.label }}</span>
        </span>
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
  style: Record<string, string>;
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

      const baseStats = [
        { label: 'Nummers', value: songCount },
        { label: 'Sets', value: setCount },
        { label: 'Ensembles', value: ensembleCount },
      ].filter((stat) => stat.value > 0);

      const values = baseStats.map((stat) => stat.value);
      const maxValue = Math.max(...values, 1);
      const minValue = Math.min(...values, maxValue);
      const valueRange = Math.max(maxValue - minValue, 1);

      return baseStats.map((stat, index) => {
        const emphasis = (stat.value - minValue) / valueRange;
        const scale = 0.94 + emphasis * 0.42;
        const drift = 0.55 + emphasis * 0.35;

        return {
          ...stat,
          style: {
            '--program-stats-scale': scale.toFixed(2),
            '--program-stats-offset-x': `${((index % 2 === 0 ? 1 : -1) * (0.2 + emphasis * 0.45)).toFixed(2)}rem`,
            '--program-stats-offset-y': `${(-0.15 + index * 0.2 - emphasis * 0.18).toFixed(2)}rem`,
            '--program-stats-float-distance': `${drift.toFixed(2)}rem`,
            '--program-stats-duration': `${(6.4 + index * 0.9 - emphasis * 0.8).toFixed(2)}s`,
            '--program-stats-delay': `${(-1.1 * index).toFixed(2)}s`,
          },
        };
      });
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
  margin: 0 auto -2rem auto;
  padding: 0;
  list-style: none;
  z-index: 2;
}

.program-stats-cloud__item {
  margin: -0.3rem -0.35rem;
}

.program-stats-cloud__pill {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.6em 1.15em;
  border-radius: 999px;
  color: vars.$white;
  font-family: var(--program-font-display, #{vars.$font-fam-heading});
  font-size: clamp(1.1rem, 2vw + 0.3rem, 2.4rem);
  line-height: 0.95;
  text-transform: uppercase;
  text-shadow: 1px 1px 3px rgba(vars.$black, 0.2);
  white-space: nowrap;
  mix-blend-mode: multiply;
  box-shadow: 0 14px 28px rgba(vars.$black, 0.12);
  transform: translate(var(--program-stats-offset-x, 0), var(--program-stats-offset-y, 0))
    scale(var(--program-stats-scale, 1));
  animation: stats-cloud-float var(--program-stats-duration, 6.5s) ease-in-out
    var(--program-stats-delay, 0s) infinite;
  will-change: transform;
}

.program-stats-cloud__item:nth-child(3n + 1) .program-stats-cloud__pill {
  background: #{vars.$rose};
}

.program-stats-cloud__item:nth-child(3n + 2) .program-stats-cloud__pill {
  background: #{vars.$pink};
}

.program-stats-cloud__item:nth-child(3n) .program-stats-cloud__pill {
  background: #{vars.$pimple};
}

.program-stats-cloud__item:nth-child(4n) .program-stats-cloud__pill {
  background: #{vars.$pink};
}

.program-stats-cloud__label {
  letter-spacing: 0.03em;
}

.program-stats-cloud__value {
  font-size: 1em;
}

@keyframes stats-cloud-float {
  0%,
  100% {
    transform: translate(var(--program-stats-offset-x, 0), var(--program-stats-offset-y, 0))
      scale(var(--program-stats-scale, 1));
  }

  50% {
    transform: translate(
        var(--program-stats-offset-x, 0),
        calc(var(--program-stats-offset-y, 0) - var(--program-stats-float-distance, 0.65rem))
      )
      scale(var(--program-stats-scale, 1));
  }
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
    margin: -0.15rem -0.2rem;
  }

  .program-stats-cloud__pill {
    font-size: clamp(1rem, 5vw, 1.8rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .program-stats-cloud__pill {
    animation: none;
  }
}
</style>
