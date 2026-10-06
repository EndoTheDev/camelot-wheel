<script setup lang="ts">
// Interactive Camelot wheel: two concentric rings.
// Outer ring = B (major), inner ring = A (minor), hub in the center.
// Click = lock selection, hover = preview compatibles.
import { ALL_KEYS, compatibleKeys, type Key } from '~/utils/keys';
import { comboTargets } from '~/utils/combos';
import { useSelection } from '~/composables/useSelection';

function segHue(n: number): number {
  return (n - 1) * 30;
}

// shared with the table - hover/select lights up both views
const { selected, hovered, activeCombos } = useSelection();

const activeSet = computed(() => {
  const base = selected.value ?? hovered.value;
  return base ? compatibleKeys(base) : null;
});

// advanced combos for the active key - separate visual tier (dotted outline)
const activeComboMap = computed(() => {
  const base = selected.value ?? hovered.value;
  if (!base || activeCombos.value.size === 0) return null;
  return comboTargets(base, activeCombos.value);
});

function segClass(k: Key): string {
  if (!activeSet.value) {
    if (activeComboMap.value?.has(k.camelot)) return 'cw-combo';
    return 'cw-compat';
  }
  if (selected.value === k.camelot) return 'cw-compat';
  if (activeSet.value.has(k.camelot)) return 'cw-compat';
  if (activeComboMap.value?.has(k.camelot)) return 'cw-combo';
  return 'cw-dim';
}

// geometry: 520 viewBox. B ring 160->240, A ring 75->155, hub r=70.
const CX = 260;
const CY = 260;
const R_B_OUT = 240;
const R_B_IN = 160;
const R_A_OUT = 155;
const R_A_IN = 75;

// annular wedge path between two radii for one 30deg position n (1-12)
function ringPath(n: number, rOut: number, rIn: number): string {
  const start = ((n - 1) * 30 - 90 - 15) * (Math.PI / 180);
  const end = start + 30 * (Math.PI / 180);
  const x1 = CX + rOut * Math.cos(start);
  const y1 = CY + rOut * Math.sin(start);
  const x2 = CX + rOut * Math.cos(end);
  const y2 = CY + rOut * Math.sin(end);
  const x3 = CX + rIn * Math.cos(end);
  const y3 = CY + rIn * Math.sin(end);
  const x4 = CX + rIn * Math.cos(start);
  const y4 = CY + rIn * Math.sin(start);
  return `M ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 0 0 ${x4} ${y4} Z`;
}

function labelPos(n: number, r: number): { x: number; y: number } {
  const mid = ((n - 1) * 30 - 90) * (Math.PI / 180);
  return { x: CX + r * Math.cos(mid), y: CY + r * Math.sin(mid) };
}

const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

function keyFor(n: number, letter: 'A' | 'B'): Key {
  return ALL_KEYS.find(k => k.camelot === `${n}${letter}`)!;
}

function pick(n: number, letter: 'A' | 'B') {
  const k = `${n}${letter}`;
  selected.value = selected.value === k ? null : k;
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <svg
      viewBox="0 0 520 520"
      class="w-full max-w-md select-none"
      role="img"
      aria-label="Camelot wheel - select a key to see compatible keys"
    >
      <!-- outer ring: B major -->
      <g v-for="n in numbers" :key="'b' + n">
        <path
          :d="ringPath(n, R_B_OUT, R_B_IN)"
          class="cursor-pointer"
          :class="segClass(keyFor(n, 'B'))"
          :fill="`hsl(${segHue(n)} 55% 45%)`"
          stroke="rgba(0,0,0,0.25)"
          stroke-width="1"
          @click="pick(n, 'B')"
          @mouseenter="hovered = `${n}B`"
          @mouseleave="hovered = null"
        />
      </g>
      <!-- inner ring: A minor -->
      <g v-for="n in numbers" :key="'a' + n">
        <path
          :d="ringPath(n, R_A_OUT, R_A_IN)"
          class="cursor-pointer"
          :class="segClass(keyFor(n, 'A'))"
          :fill="`hsl(${segHue(n)} 55% 38%)`"
          stroke="rgba(0,0,0,0.25)"
          stroke-width="1"
          @click="pick(n, 'A')"
          @mouseenter="hovered = `${n}A`"
          @mouseleave="hovered = null"
        />
      </g>
      <!-- hub -->
      <circle :cx="CX" :cy="CY" r="70" fill="var(--cw-bg)" stroke="var(--cw-muted)" stroke-width="1" style="pointer-events: none" />
      <text
        v-if="selected || hovered"
        :x="CX"
        :y="CY"
        text-anchor="middle"
        dominant-baseline="middle"
        class="cw-display cw-mono cw-selected-text"
        :font-size="30"
        style="pointer-events: none"
      >
        {{ selected ?? hovered }}
      </text>
      <text
        v-else
        :x="CX"
        :y="CY"
        text-anchor="middle"
        dominant-baseline="middle"
        :font-size="14"
        fill="var(--cw-muted)"
        style="pointer-events: none"
      >
        pick a key
      </text>
      <!-- labels: never intercept the pointer, clicks pass to the wedges -->
      <g v-for="n in numbers" :key="'l' + n" style="pointer-events: none">
        <text
          v-bind="labelPos(n, 200)"
          text-anchor="middle"
          dominant-baseline="middle"
          class="cw-display cw-mono"
          :fill="selected === `${n}B` ? 'var(--cw-accent)' : 'white'"
          :font-size="18"
        >
          {{ n }}B
        </text>
        <text
          v-bind="labelPos(n, 115)"
          text-anchor="middle"
          dominant-baseline="middle"
          class="cw-display cw-mono"
          :fill="selected === `${n}A` ? 'var(--cw-accent)' : 'white'"
          :font-size="18"
        >
          {{ n }}A
        </text>
      </g>
    </svg>
    <p class="text-sm" style="color: var(--cw-muted)">
      click a key - same letter ±1 and the relative switch all mix
    </p>
  </div>
</template>