<template>
  <nav
    v-if="navigationItems.length"
    ref="navRef"
    class="program-page-navigation program-nav"
    aria-label="Programma navigatie"
  >
    <div class="container-fluid program-nav-inner">
      <p class="program-nav-heading">Programma</p>
      <div class="program-nav-links-scroll">
        <div class="program-nav-links">
          <a
            v-for="(item, index) in navigationItems"
            :key="item.id"
            :href="`#${item.id}`"
            :class="[
              'program-nav-link',
              { 'program-nav-link--active': activeSectionId === item.id },
            ]"
            :aria-current="activeSectionId === item.id ? 'location' : undefined"
            @click.prevent="handleNavigation(item.id)"
          >
            <span class="program-nav-link__index">{{ formatNavigationIndex(index) }}.</span>
            <span class="program-nav-link__title">{{ item.title }}</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  watch,
} from 'vue';

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
  },
  setup(props) {
    const navigationItems = computed(() => props.sections || []);
    const navRef = ref<HTMLElement | null>(null);
    const activeSectionId = ref<string>('');
    let animationFrame = 0;

    const formatNavigationIndex = (index: number): string => {
      return String(index + 1).padStart(2, '0');
    };

    const getNavigationOffset = (): number => {
      return (navRef.value?.offsetHeight || 0) + 24;
    };

    const getSectionElements = (): HTMLElement[] => {
      if (typeof document === 'undefined') {
        return [];
      }

      return navigationItems.value
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => element instanceof HTMLElement);
    };

    const updateActiveSection = (): void => {
      if (globalThis.window === undefined) {
        return;
      }

      const sections = getSectionElements();

      if (!sections.length) {
        activeSectionId.value = '';
        return;
      }

      const scrollPosition = globalThis.window.scrollY + getNavigationOffset();
      let nextActiveSectionId = sections[0].id;

      sections.forEach((section) => {
        if (section.offsetTop <= scrollPosition) {
          nextActiveSectionId = section.id;
        }
      });

      activeSectionId.value = nextActiveSectionId;
    };

    const requestActiveSectionUpdate = (): void => {
      if (globalThis.window === undefined) {
        return;
      }

      if (animationFrame) {
        globalThis.cancelAnimationFrame(animationFrame);
      }

      animationFrame = globalThis.requestAnimationFrame(() => {
        updateActiveSection();
        animationFrame = 0;
      });
    };

    const syncActiveSection = async (): Promise<void> => {
      await nextTick();

      if (globalThis.window !== undefined) {
        const hashSectionId = globalThis.window.location.hash.replace('#', '');

        if (hashSectionId) {
          activeSectionId.value = hashSectionId;
        }
      }

      requestActiveSectionUpdate();
    };

    const handleNavigation = (sectionId: string): void => {
      if (typeof document === 'undefined' || globalThis.window === undefined) {
        return;
      }

      const section = document.getElementById(sectionId);

      if (!section) {
        return;
      }

      activeSectionId.value = sectionId;

      const top =
        section.getBoundingClientRect().top + globalThis.window.scrollY - getNavigationOffset();

      globalThis.window.history.replaceState(null, '', `#${sectionId}`);
      globalThis.window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    };

    const handleHashChange = (): void => {
      if (globalThis.window === undefined) {
        return;
      }

      const hashSectionId = globalThis.window.location.hash.replace('#', '');

      if (hashSectionId) {
        activeSectionId.value = hashSectionId;
      }

      requestActiveSectionUpdate();
    };

    watch(navigationItems, () => {
      void syncActiveSection();
    });

    onMounted(() => {
      void syncActiveSection();

      globalThis.addEventListener('scroll', requestActiveSectionUpdate, {
        passive: true,
      });
      globalThis.addEventListener('resize', requestActiveSectionUpdate);
      globalThis.addEventListener('hashchange', handleHashChange);
    });

    onBeforeUnmount(() => {
      if (globalThis.window !== undefined) {
        globalThis.removeEventListener('scroll', requestActiveSectionUpdate);
        globalThis.removeEventListener('resize', requestActiveSectionUpdate);
        globalThis.removeEventListener('hashchange', handleHashChange);

        if (animationFrame) {
          globalThis.cancelAnimationFrame(animationFrame);
        }
      }
    });

    return {
      activeSectionId,
      formatNavigationIndex,
      handleNavigation,
      navigationItems,
      navRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.program-nav-inner {
  display: flex;
  gap: 1.35rem;
  align-items: center;
  padding-right: 4rem;
  position: relative;
}

.program-nav-heading {
  flex: 0 0 auto;
  margin: 0;
  color: rgba(17, 17, 17, 0.72);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  position: sticky;
  left: 1rem;
  z-index: 3;
  background: #fff;
  padding-right: 0.5rem;
}

.program-nav-links {
  display: flex;
  gap: 1rem;
  flex: 1 1 auto;
  overflow-x: auto;
  padding-right: 0.75rem;
  /* keep links visually to the right of the sticky heading */
  margin-left: 8rem;
}

.program-nav-link {
  flex: 0 0 auto;
  position: relative;
  display: inline-flex;
  gap: 0.35rem;
  align-items: baseline;
  font-weight: 500;
  transition:
    font-weight 180ms ease,
    opacity 180ms ease;

  &::after {
    position: absolute;
    bottom: -0.3rem;
    left: 0;
    width: 100%;
    height: 0.16rem;
    content: '';
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 220ms ease;
  }

  &:hover,
  &:focus-visible {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 0.25rem;
  }
}

.program-nav-link--active {
  font-weight: 700;

  &::after {
    transform: scaleX(1);
  }
}

.program-nav-link__index {
  font-variant-numeric: tabular-nums;
}

@media (max-width: 767px) {
  .program-nav-inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
    padding-right: 4.25rem;
  }

  .program-nav-heading {
    position: static;
    left: auto;
    padding-right: 0;
  }

  .program-nav-links {
    width: 100%;
    padding-right: 1rem;
    margin-left: 0;
  }
}
</style>
