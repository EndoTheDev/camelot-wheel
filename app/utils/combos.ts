// The documented special combinations. Each is a named move beyond the basic
// T (same key, +/-1 same letter, relative switch). Source: Mixed In Key's
// advanced harmonic mixing techniques + the two diagonals (only B->A +1 and
// A->B -1 work; the mirrored diagonals are dissonant and deliberately absent).
export type Combo = {
  id: string;
  label: string;
  hint: string;
  targets(key: string): string[];
};

function wrap(n: number): number {
  return ((n - 1 + 12) % 12) + 1;
}

function parse(key: string): { n: number; l: 'A' | 'B' } | null {
  const m = /^(\d{1,2})([AB])$/.exec(key);
  return m ? { n: Number.parseInt(m[1], 10), l: m[2] as 'A' | 'B' } : null;
}

function sameLetterShift(key: string, delta: number): string {
  const p = parse(key)!;
  return `${wrap(p.n + delta)}${p.l}`;
}

export const COMBOS: Combo[] = [
  {
    id: 'energy-2',
    label: 'energy boost +2',
    hint: 'two steps up, same letter - the classic lift (8A -> 10A)',
    targets: k => [sameLetterShift(k, 2)],
  },
  {
    id: 'energy-7',
    label: 'boost +7',
    hint: 'one-semitone jump, same letter (2A -> 9A) - aggressive, peak time',
    targets: k => [sameLetterShift(k, 7)],
  },
  {
    id: 'diagonal',
    label: 'diagonal',
    hint: 'B->A +1 / A->B -1 and switch letter (8B -> 9A, 8A -> 7B)',
    targets: (k) => {
      const p = parse(k)!;
      // B->A: +1, A->B: -1. mirrored directions are dissonant - not offered.
      return p.l === 'B' ? [`${wrap(p.n + 1)}A`] : [`${wrap(p.n - 1)}B`];
    },
  },
  {
    id: 'jaws',
    label: 'jaws -5',
    hint: 'five steps down, same letter (8A -> 3A) - dramatic surprise',
    targets: k => [sameLetterShift(k, -5)],
  },
  {
    id: 'pay-attention',
    label: 'pay attention -3',
    hint: 'three steps down, same letter (8A -> 5A) - intentional surprise',
    targets: k => [sameLetterShift(k, -3)],
  },
  {
    id: 'guetta',
    label: 'guetta +4',
    hint: 'four up (10B -> 2B) - dissonant at first, occasionally magic',
    targets: k => [sameLetterShift(k, 4)],
  },
  {
    id: 'tritone',
    label: 'tritone ±6',
    hint: 'half-octave jump (8A -> 2A) - maximum drama, planned moment',
    targets: k => [sameLetterShift(k, 6)],
  },
];

// map of target key -> combo id, for the active combos. separate tier from the
// basic compatible set so the safe T stays visually distinct from the spice.
export function comboTargets(key: string, activeComboIds: Set<string>): Map<string, string> {
  const out = new Map<string, string>();
  for (const c of COMBOS) {
    if (!activeComboIds.has(c.id)) continue;
    for (const t of c.targets(key)) {
      if (!out.has(t)) out.set(t, c.id);
    }
  }
  return out;
}

// one runnable check: fails if the combo math breaks
// run manually: CAMELOT_SELF_CHECK=1 node --experimental-strip-types app/utils/combos.ts
if (process.env.CAMELOT_SELF_CHECK === '1') {
  const expect = (id: string, key: string, want: string) => {
    const c = COMBOS.find(x => x.id === id)!;
    const got = c.targets(key).join();
    const ok = got === want;
    if (!ok) console.log(`FAIL ${id} from ${key}: got ${got}, want ${want}`);
    return ok;
  };
  let ok = true;
  ok = expect('energy-2', '8A', '10A') && ok;
  ok = expect('energy-7', '2A', '9A') && ok;
  ok = expect('diagonal', '8B', '9A') && ok;
  ok = expect('diagonal', '8A', '7B') && ok;
  ok = expect('jaws', '8A', '3A') && ok;
  ok = expect('pay-attention', '8A', '5A') && ok;
  ok = expect('guetta', '10B', '2B') && ok;
  ok = expect('tritone', '8A', '2A') && ok;
  console.log(ok ? 'COMBO CHECK PASS' : 'COMBO CHECK FAIL');
  process.exit(ok ? 0 : 1);
}