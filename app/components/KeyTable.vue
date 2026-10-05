<script setup lang="ts">
// Compatibility table: the crawlable half. Every key row with its compatible set.
import { ALL_KEYS, compatibleKeys } from '~/utils/keys';

const expanded = ref<string | null>(null);

function compatList(camelot: string): string[] {
  return [...compatibleKeys(camelot)].filter(k => k !== camelot).sort();
}
</script>

<template>
  <div class="w-full max-w-xl">
    <h2 class="cw-display mb-4 text-xl">
      what mixes with what
    </h2>
    <div class="overflow-hidden rounded-lg border" style="border-color: var(--cw-muted)">
      <table class="cw-mono w-full text-sm">
        <thead>
          <tr style="background: color-mix(in srgb, var(--cw-accent) 8%, transparent)">
            <th class="p-2 text-left">key</th>
            <th class="p-2 text-left">classical</th>
            <th class="p-2 text-left">open key</th>
            <th class="p-2 text-left">mixes with</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="k in ALL_KEYS"
            :key="k.camelot"
            class="cursor-pointer"
            :style="expanded === k.camelot ? 'background: color-mix(in srgb, var(--cw-accent) 12%, transparent)' : ''"
            @click="expanded = expanded === k.camelot ? null : k.camelot"
          >
            <td class="p-2 font-bold" style="color: var(--cw-accent)">
              {{ k.camelot }}
            </td>
            <td class="p-2">{{ k.classical }}</td>
            <td class="p-2">{{ k.openKey }}</td>
            <td class="p-2">{{ compatList(k.camelot).join(' ') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>