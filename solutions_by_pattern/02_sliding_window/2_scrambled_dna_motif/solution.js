// Run: node solution.js
// Scrambled DNA Motif (LeetCode #438 Find All Anagrams in a String). See tutorial.md.

function findScrambledMotif(genome, motif) {
  const k = motif.length;
  const result = [];
  if (k > genome.length) return result;

  // need[letter] = how many of that letter the motif has.
  // have[letter] = how many are in the current window.
  const need = new Map();
  const have = new Map();
  for (const ch of motif) need.set(ch, (need.get(ch) ?? 0) + 1);

  // `matched` = how many distinct letters currently have EXACTLY the right count.
  // When matched === need.size, the window is an anagram. That's an O(1) check per step.
  let matched = 0;

  const add = (ch) => {
    if (!need.has(ch)) return; // a letter the motif doesn't use can never be matched
    if (have.get(ch) === need.get(ch)) matched--; // it was exact, and now there's one too many
    have.set(ch, (have.get(ch) ?? 0) + 1);
    if (have.get(ch) === need.get(ch)) matched++; // it just became exact
  };

  const remove = (ch) => {
    if (!need.has(ch)) return;
    if (have.get(ch) === need.get(ch)) matched--;
    have.set(ch, have.get(ch) - 1);
    if (have.get(ch) === need.get(ch)) matched++;
  };

  for (let right = 0; right < genome.length; right++) {
    add(genome[right]); // the letter entering the window
    if (right >= k) remove(genome[right - k]); // the letter leaving it (fixed size k)

    // Once the window is full, check it. It starts at right - k + 1.
    if (right >= k - 1 && matched === need.size) {
      result.push(right - k + 1);
    }
  }

  return result;
}

// ---- tests (identical to the problem's index.js) ----

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) console.log(`      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`);
}

function run(name, fn) {
  try {
    fn();
  } catch (err) {
    console.log(`FAIL  ${name} (threw: ${err.message})`);
  }
}

const cases = [
  ["example", "ACGTCAGT", "CAG", [0, 4]],
  ["overlapping matches", "AAAA", "AA", [0, 1, 2]],
  ["two-letter motif", "GATTACA", "TA", [1, 3]],
  ["whole genome matches", "TGCA", "ACGT", [0]],
  ["counts matter, not just letters", "AACC", "ACC", [1]],
  ["no match", "GGGG", "A", []],
  ["motif longer than genome", "AC", "ACG", []],
  ["match at the very end", "TTTTCA", "AC", [4]],
];

for (const [name, genome, motif, expected] of cases) {
  run(name, () => check(name, findScrambledMotif(genome, motif), expected));
}

run("large input (should be instant)", () => {
  // Deterministic pseudo-random genome, so the expected count is fixed.
  const letters = "ACGT";
  let seed = 42;
  let genome = "";
  for (let i = 0; i < 200000; i++) {
    seed = (seed * 48271) % 2147483647;
    genome += letters[seed % 4];
  }
  const motif = "ACGTACGTAC";
  const start = Date.now();
  const result = findScrambledMotif(genome, motif);
  const ms = Date.now() - start;
  check(`large input (${ms}ms, should be well under 1000ms)`, { count: result.length, fast: ms < 1000 }, { count: 5096, fast: true });
});
