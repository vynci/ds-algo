// Run: node index.js

function findScrambledMotif(genome, motif) {
  // TODO
}

// ---- tests ----

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
