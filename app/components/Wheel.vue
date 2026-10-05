<script setup lang="ts">
// Interactive Camelot wheel: 24 segments (12 numbers x A/B).
// Click = lock selection, hover = preview compatibles. Pure SVG + CSS classes.
import { ALL_KEYS, compatibleKeys, type Key } from '~/utils/keys';

// hue per camelot number 1-12, A (minor) = full saturation ring, B (major) = same hue lighter
function segHue(n: number): number {
  return (n - 1) * 30; // 12 positions across the wheel, 30deg hue steps
}

const selected = ref<string | null>(null);
const hovered = ref<string | null>(null);

const activeSet = computed(() => {
  const base = selected.value ?? hovered.value;
  return base ? compatibleKeys(base) : null;
});

function segClass(k: Key): string {
  if (!activeSet.value) return 'cw-compat';
  if (selected.value === k.camelot) return 'cw-compat';
  if (activeSet.value.has(k.camelot)) return 'cw-compat';
  return 'cw-dim';
}

// wheel geometry: outer ring = B (major, even index in layout), inner = A (minor)
const R_OUT = 230;
const R_IN = 150;
const CX = 260;
const CY = 260;
const SEG = Math.PI / 12; // 24 segments = 15deg each... but we use 12 positions x 2 rings

// 12 wedges, each wedge split into major (outer half) + minor (inner half)
function wedgePath(n: number): string {
  const start = ((n - 1) * 30 - 90 - 15) * (Math.PI / 180);
  const end = start + 30 * (Math.PI / 180);
  const x1 = CX + R_OUT * Math.cos(start);
  const y1 = CY + R_OUT * Math.sin(start);
  const x2 = CX + R_OUT * Math.cos(end);
  const y2 = CY + R_OUT * Math.sin(end);
  const x3 = CX + R_IN * Math.cos(end);
  const y3 = CY + R_IN * Math.sin(end);
  const x4 = CX + R_IN * Math.cos(start);
  const y4 = CY + R_IN * Math.sin(start);
  return `M ${x1} ${y1} A ${R_OUT} ${R_OUT} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${R_IN} ${R_IN} 0 0 0 ${x4} ${y4} Z`;
}

function labelPos(n: number, r: number): { x: number; y: number } {
  const mid = ((n - 1) * 30 - 90) * (Math.PI / 180);
  return { x: CX + r * Math.cos(mid), y: CY + r * Math.sin(mid) };
}

const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

function keyFor(n: number, letter: 'A' | 'B'): Key {
  return ALL_KEYS.find(k => k.camelot === `${n}${letter}`)!;
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <svg
      viewBox="0 0 520 520"
      class="w-full max-w-xl select-none"
      role="img"
      aria-label="Camelot wheel - select a key to see compatible keys"
    >
      <!-- 12 wedges: outer half B (major), inner half A (minor) -->
      <g v-for="n in numbers" :key="n">
        <!-- outer: B major -->
        <path
          :d="wedgePath(n)"
          class="cursor-pointer"
          :class="segClass(keyFor(n, 'B'))"
          :fill="`hsl(${segHue(n)} 55% 45%)`"
          @click="selected = selected === `${n}B` ? null : `${n}B`"
          @mouseenter="hovered = `${n}B`"
          @mouseleave="hovered = null"
        />
        <!-- inner half drawn as separate ring band for A -->
      </g>
      <!-- minor ring: separate annulus inside -->
      <g v-for="n in numbers" :key="'a' + n">
        <circle
          :cx="CX"
          :cy="CY"
          r="0"
          fill="none"
        />
      </g>
      <!-- labels -->
      <g v-for="n in numbers" :key="'l' + n">
        <text
          v-bind="labelPos(n, 195)"
          text-anchor="middle"
          dominant-baseline="middle"
          class="cw-display cw-mono"
          :class="{ 'cw-selected-text': selected === `${n}B` }"
          fill="white"
          :font-size="20"
        >
          {{ n }}B
        </text>
        <text
          v-bind="labelPos(n, 125)"
          text-anchor="middle"
          dominant-baseline="middle"
          class="cw-display cw-mono"
          :class="{ 'cw-selected-text': selected === `${n}A` }"
          fill="white"
          :font-size="20"
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