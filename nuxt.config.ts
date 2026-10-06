export default defineNuxtConfig({
  compatibilityDate: '2026-10-06',

  // SSR on: the compatibility table is crawlable text (SEO).
  ssr: true,

  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  app: {
    // assets must resolve under the tool's own path, not the domain root
    // (the main website serves /_nuxt/* from a different build and 404s ours)
    baseURL: '/tools/camelot-wheel/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Camelot Wheel - Harmonic Mixing Guide',
      meta: [
        {
          name: 'description',
          content:
            'Interactive Camelot wheel for harmonic mixing. Pick a key, see which keys fit. Camelot, classical and Traktor Open Key notation.',
        },
      ],
    },
  },
});