<script setup lang="ts">
// home page: wheel hero + table below. All server-rendered for crawlers.
</script>

<template>
  <div class="min-h-screen" style="background: var(--cw-bg); color: var(--cw-text)">
    <header class="mx-auto flex max-w-2xl items-center justify-between px-4 pt-6">
      <h1 class="cw-display text-2xl">
        camelot wheel
      </h1>
      <!-- placeholder: color mode toggle (Nuxt UI UColorModeButton) lands with the nuxt ui wiring -->
    </header>

    <main class="mx-auto flex max-w-2xl flex-col items-center gap-10 px-4 py-8">
      <p class="max-w-lg text-center text-sm" style="color: var(--cw-muted)">
        pick a key, see which keys fit. same letter up or down one step, and the
        relative major/minor switch - that's the whole system.
      </p>
      <Wheel />
      <KeyTable />
    </main>

    <footer class="pb-8 text-center text-xs" style="color: var(--cw-muted)">
      built by <a href="https://endothe.dev" style="color: var(--cw-accent)">endo</a> - deployed from a raspberry pi
    </footer>
  </div>
</template>