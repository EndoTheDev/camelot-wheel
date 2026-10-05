import type { ModuleOptions } from '@nuxt/ui';

export default defineAppConfig({
  ui: {
    colors: {
      // amber/gold accent - the DJ-booth look, distinct from endothe.dev blue
      primary: 'amber',
      neutral: 'stone',
    },
  } satisfies ModuleOptions['ui'],
});