<script setup lang="ts">
// Compatibility table: the crawlable half. Every key row with its compatible set.
// Rows highlight in sync with the wheel (shared useSelection state):
// - active key: strong amber row
// - basic compatibles: soft amber
// - advanced combo targets (when toggled): dotted outline + combo chip
import { ALL_KEYS, compatibleKeys } from '~/utils/keys';
import { COMBOS, comboTargets } from '~/utils/combos';
import { useSelection } from '~/composables/useSelection';

const { selected, hovered, activeCombos } = useSelection();

const activeKey = computed(() => selected.value ?? hovered.value);
const activeSet = computed(() => (activeKey.value ? compatibleKeys(activeKey.value) : null));
const activeComboMap = computed(() => {
  if (!activeKey.value || activeCombos.value.size === 0) return null;
  return comboTargets(activeKey.value, activeCombos.value);
});

function rowClass(k: string): string {
  if (!activeSet.value) return '';
  if (selected.value === k) return 'cw-row-active';
  if (activeSet.value.has(k)) return 'cw-row-compat';
  return 'cw-row-dim';
}

function comboChip(k: string): string {
  const id = activeComboMap.value?.get(k);
  return COMBOS.find(c => c.id === id)?.label ?? '';
}

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
            :class="rowClass(k.camelot)"
            @mouseenter="hovered = k.camelot"
            @mouseleave="hovered = null"
            @click="selected = selected === k.camelot ? null : k.camelot"
          >
            <td class="p-2 font-bold" style="color: var(--cw-accent)">
              {{ k.camelot }}
              <span v-if="comboChip(k.camelot)" class="cw-combo-chip">{{ comboChip(k.camelot) }}</span>
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

<style scoped>
/* table rows mirror the wheel's three tiers */
tr.cw-row-active {
  background: color-mix(in srgb, var(--cw-accent) 20%, transparent);
}

tr.cw-row-compat {
  background: color-mix(in srgb, var(--cw-accent) 10%, transparent);
}

tr.cw-row-dim {
  opacity: 0.35;
}

tr:has(.cw-combo-chip) {
  outline: 1.5px dashed var(--cw-accent);
  outline-offset: -1.5px;
}

.cw-combo-chip {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0 0.35rem;
  border: 1px dashed var(--cw-accent);
  border-radius: 4px;
  font-size: 0.65rem;
  opacity: 0.85;
}
</style>