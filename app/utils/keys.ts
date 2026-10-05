// Camelot wheel compatibility logic.
// The system: same letter (A=minor, B=major), +/-1 energy steps, plus the
// relative major/minor switch (8A <-> 8B). ~20 lines, no libraries.

export interface Key {
  camelot: string; // "8A"
  classical: string; // "A minor"
  openKey: string; // "1m" (Traktor)
}

// ponytail: static mapping arrays, built once. Camelot is the index space.
const SHARP_MINORS = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A# (Bb)', 'F', 'C', 'G', 'D'];
const SHARP_MAJORS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C# (Db)', 'G# (Ab)', 'D# (Eb)', 'A# (Bb)', 'F'];

function openKeyMinors(): string[] {
  // Traktor Open Key: 1m = A minor ... 12m
  const minors = ['1m', '12m', '11m', '10m', '9m', '8m', '7m', '6m', '5m', '4m', '3m', '2m'];
  return minors;
}

function openKeyMajors(): string[] {
  const majors = ['1d', '12d', '11d', '10d', '9d', '8d', '7d', '6d', '5d', '4d', '3d', '2d'];
  return majors;
}

export const ALL_KEYS: Key[] = (() => {
  const keys: Key[] = [];
  for (let n = 1; n <= 12; n++) {
    const mi = n - 1;
    const mj = (n + 3) % 12; // Camelot number n major = relative of n+3 minor scale position
    keys.push({
      camelot: `${n}A`,
      classical: `${SHARP_MINORS[mi]} minor`,
      openKey: openKeyMinors()[mi],
    });
    keys.push({
      camelot: `${n}B`,
      classical: `${SHARP_MAJORS[(n - 1 + 7) % 12]} major`,
      openKey: openKeyMajors()[n - 1],
    });
  }
  return keys;
})();

// The compatible set for a camelot key:
// - same letter, number +/-1 (wrap 12 <-> 1)
// - same number, other letter (relative major/minor)
// - the key itself (it obviously mixes)
export function compatibleKeys(camelot: string): Set<string> {
  const m = /^(\d{1,2})([AB])$/.exec(camelot);
  if (!m) return new Set();
  const num = Number.parseInt(m[1], 10);
  const letter = m[2];
  const up = num === 12 ? 1 : num + 1;
  const down = num === 1 ? 12 : num - 1;
  const other = letter === 'A' ? 'B' : 'A';
  return new Set([camelot, `${up}${letter}`, `${down}${letter}`, `${num}${other}`]);
}

export function keyByCamelot(camelot: string): Key | undefined {
  return ALL_KEYS.find(k => k.camelot === camelot);
}

// one runnable check: fails if the logic breaks
// run: bunx tsx app/utils/keys.ts (or node --experimental-strip-types)
if (typeof Bun !== 'undefined' || typeof process !== 'undefined') {
  const c8a = compatibleKeys('8A');
  console.log('8A ->', [...c8a].sort().join(', '));
  const c1a = compatibleKeys('1A');
  console.log('1A ->', [...c1a].sort().join(', '));
  const ok1 = [...c8a].sort().join() === ['8A', '7A', '9A', '8B'].sort().join();
  const ok2 = [...c1a].sort().join() === ['1A', '12A', '2A', '1B'].sort().join();
  console.log(ok1 && ok2 ? 'SELF-CHECK PASS' : 'SELF-CHECK FAIL');
  if (typeof process !== 'undefined') process.exit(ok1 && ok2 ? 0 : 1);
}