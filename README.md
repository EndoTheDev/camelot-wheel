# camelot wheel

Interactive Camelot wheel for harmonic mixing. Pick a key, see which keys fit.

Live at [endothe.dev/tools/camelot-wheel](https://endothe.dev/tools/camelot-wheel).

- Nuxt 4 + Nuxt UI, dark-first amber theme
- Camelot / classical / Traktor Open Key notation toggle
- Compatibility table for every key (the crawlable half of the tool)
- EN / DE / TH

Self-check of the compatibility math:

```bash
node --experimental-strip-types app/utils/keys.ts
```

Part of the endothe.dev tools series - each tool is a standalone repo, deployed from a Raspberry Pi.