import type { ModuleOptions } from '@nuxt/ui';

export default defineAppConfig({
  ui: {
    colors: {
      // amber/gold accent - the DJ-booth look, distinct from endothe.dev blue
      primary: 'amber',
      neutral: 'stone',
    },
    // use @nuxtjs/color-mode directly (like the main site) - same button,
    // same system-default behavior, same storage key.
    colorMode: false,
  } satisfies ModuleOptions['ui'],
});