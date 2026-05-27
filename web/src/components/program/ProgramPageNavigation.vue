<template>
  <nav
    v-if="navigationItems.length"
    class="program-page-navigation program-preview__nav"
    aria-label="Programma navigatie"
  >
    <div class="container-fluid program-preview__nav-inner">
      <a
        v-for="item in navigationItems"
        :key="item.id"
        :href="`#${item.id}`"
      >
        {{ item.title }}
      </a>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

interface ProgramPageNavigationItem {
  id: string;
  title: string;
}

export default defineComponent({
  name: 'ProgramPageNavigation',
  props: {
    sections: {
      type: Array as PropType<ProgramPageNavigationItem[]>,
      default: () => [],
    },
    includeOverview: {
      type: Boolean,
      default: false,
    },
    includeHighlights: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const navigationItems = computed<ProgramPageNavigationItem[]>(() => {
      const items: ProgramPageNavigationItem[] = [];

      if (props.includeOverview) {
        items.push({ id: 'overview', title: 'Overzicht' });
      }

      if (props.includeHighlights) {
        items.push({ id: 'spotlight', title: 'Highlights' });
      }

      return [...items, ...props.sections];
    });

    return { navigationItems };
  },
});
</script>
