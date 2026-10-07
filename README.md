# check-key

check-key: interactive Camelot wheel for harmonic mixing (formerly camelot-wheel). Pick a key, see which keys fit.

Live at [endothe.dev/tools/check-key](https://endothe.dev/tools/check-key).

- Nuxt 4 + Nuxt UI, dark-first amber theme
- Camelot / classical / Traktor Open Key notation toggle
- Compatibility table for every key (the crawlable half of the tool)
- EN / DE / TH

Self-check of the compatibility math:

```bash
node --experimental-strip-types app/utils/keys.ts
```

Part of the endothe.dev tools series - each tool is a standalone repo, deployed from a Raspberry Pi.