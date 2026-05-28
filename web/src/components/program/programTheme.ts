import { computed, inject, type ComputedRef, type InjectionKey } from 'vue';

export interface ProgramThemeContext {
  themeSlug: ComputedRef<string>;
  themeClass: ComputedRef<string>;
  isTheme: (themeSlug: string) => boolean;
}

export const PROGRAM_THEME_CONTEXT: InjectionKey<ProgramThemeContext> =
  Symbol('PROGRAM_THEME_CONTEXT');

export function createProgramThemeClass(themeSlug: string): string {
  return themeSlug ? `program-theme--${themeSlug}` : '';
}

const fallbackThemeSlug = computed(() => '');

const fallbackThemeContext: ProgramThemeContext = {
  themeSlug: fallbackThemeSlug,
  themeClass: computed(() => ''),
  isTheme: (themeSlug: string) => fallbackThemeSlug.value === themeSlug,
};

export function useProgramTheme(): ProgramThemeContext {
  return inject(PROGRAM_THEME_CONTEXT, fallbackThemeContext);
}
