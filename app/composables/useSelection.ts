// Shared selection state between wheel and table - both highlight the same key.
// activeCombos = which advanced combos the user toggled on.
// ponytail: module-level refs instead of a store/pinia - one page, two consumers.
// ceiling: if a second page ever needs independent selections, move into a composable factory.
const selected = ref<string | null>(null);
const hovered = ref<string | null>(null);
const activeCombos = ref<Set<string>>(new Set());

export function useSelection() {
  return { selected, hovered, activeCombos };
}