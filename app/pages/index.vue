<script setup lang="ts">
// home page: wheel hero + table below. All server-rendered for crawlers.
import { COMBOS } from '~/utils/combos';
import { useSelection } from '~/composables/useSelection';

const { activeCombos } = useSelection();

function toggleCombo(id: string) {
  const next = new Set(activeCombos.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  activeCombos.value = next;
}
</script>

<template>
  <div class="min-h-screen" style="background: var(--cw-bg); color: var(--cw-text)">
    <header class="mx-auto flex max-w-6xl items-center justify-between px-4 pt-6">
      <h1 class="cw-display text-2xl">
        camelot wheel
      </h1>
      <ColorModeButton />
    </header>

    <!-- desktop: wheel left, table right. mobile: wheel top, table below. -->
    <main class="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-8 lg:flex-row lg:items-start lg:justify-center">
      <p class="max-w-lg text-center text-sm lg:hidden" style="color: var(--cw-muted)">
        pick a key, see which keys fit. same letter up or down one step, and the
        relative major/minor switch - that's the whole system.
      </p>
      <!-- wheel: capped to viewport so it never needs scrolling; shrink-0 keeps its
           size while the wider two-column table pushes the row's center left -->
      <div class="wheel-wrap order-1 flex shrink-0 flex-col items-center gap-4">
        <Wheel />
        <p class="hidden max-w-md text-center text-sm lg:block" style="color: var(--cw-muted)">
          pick a key, see which keys fit. same letter up or down one step, and the
          relative major/minor switch - that's the whole system.
        </p>
        <p class="hidden max-w-md text-center text-xs lg:block" style="color: var(--cw-muted)">
          harmonic mixing is a guide, not a rulebook. combos need experimentation -
          your ears are the final judge.
        </p>
      </div>
      <div class="order-2 w-full max-w-3xl">
        <!-- advanced combos panel: default off, one toggle per named move -->
        <div class="mb-4 flex flex-wrap gap-2" aria-label="advanced combos">
          <button
            v-for="c in COMBOS"
            :key="c.id"
            :title="c.hint"
            class="cw-mono rounded-full border px-3 py-1 text-xs"
            :style="activeCombos.has(c.id)
              ? 'border-color: var(--cw-accent); color: var(--cw-accent); background: color-mix(in srgb, var(--cw-accent) 12%, transparent)'
              : 'border-color: var(--cw-muted); color: var(--cw-muted)'"
            @click="toggleCombo(c.id)"
          >
            {{ c.label }}
          </button>
        </div>
        <KeyTable />
      </div>
    </main>

    <!-- footer: disclaimer on mobile (desktop sees it under the wheel) + source link -->
    <footer class="flex flex-col items-center gap-2 px-4 pb-8 text-center text-xs" style="color: var(--cw-muted)">
      <p class="max-w-md lg:hidden">
        harmonic mixing is a guide, not a rulebook. combos need experimentation -
        your ears are the final judge.
      </p>
      <p>
        built by <a href="https://endothe.dev" style="color: var(--cw-accent)">endo</a> -
        deployed from a raspberry pi -
        <a href="https://github.com/EndoTheDev/camelot-wheel" style="color: var(--cw-accent)">source on github</a>
      </p>
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