<script setup lang="ts">
// home page: wheel hero + table below. All server-rendered for crawlers.
</script>

<template>
  <div class="min-h-screen" style="background: var(--cw-bg); color: var(--cw-text)">
    <header class="mx-auto flex max-w-6xl items-center justify-between px-4 pt-6">
      <h1 class="cw-display text-2xl">
        camelot wheel
      </h1>
      <UColorModeButton size="sm" variant="ghost" />
    </header>

    <!-- desktop: wheel left, table right. mobile: wheel top, table below. -->
    <main class="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-8 lg:flex-row lg:items-start lg:justify-center">
      <p class="max-w-lg text-center text-sm lg:hidden" style="color: var(--cw-muted)">
        pick a key, see which keys fit. same letter up or down one step, and the
        relative major/minor switch - that's the whole system.
      </p>
      <!-- wheel: capped to viewport so it never needs scrolling -->
      <div class="wheel-wrap order-1 flex flex-col items-center gap-4">
        <Wheel />
        <p class="hidden max-w-md text-center text-sm lg:block" style="color: var(--cw-muted)">
          pick a key, see which keys fit. same letter up or down one step, and the
          relative major/minor switch - that's the whole system.
        </p>
      </div>
      <div class="order-2 w-full max-w-xl">
        <KeyTable />
      </div>
    </main>

    <footer class="pb-8 text-center text-xs" style="color: var(--cw-muted)">
      built by <a href="https://endothe.dev" style="color: var(--cw-accent)">endo</a> - deployed from a raspberry pi
    </footer>
  </div>
</template>

<style scoped>
/* wheel never taller than the viewport minus chrome - no scrolling to see it whole */
.wheel-wrap :deep(svg) {
  max-height: calc(100vh - 12rem);
  width: auto;
}
</style>