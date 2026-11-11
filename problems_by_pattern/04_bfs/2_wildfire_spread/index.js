// Run: node index.js

function minutesToBurn(forest) {
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
  ["example", ["FTT", "TT.", ".TT"], 4],
  ["unreachable tree", ["FTT", ".TT", "T.T"], -1],
  ["no healthy trees", [".F"], 0],
  ["no fire at all", ["TT"], -1],
  ["empty forest", [], 0],
  ["only bare ground", ["...", "..."], 0],
  ["two fires spread at once", ["FTTTF"], 2],
  ["fire in the middle", ["TTTFTTT"], 3],
  ["diagonal does not spread", ["F.", ".T"], -1],
  ["firebreak wall", ["FT.T", "TT.T"], -1],
  ["winding path", ["FTTTT", "....T", "TTTTT", "T....", "TTTTT"], 16],
];

for (const [name, forest, expected] of cases) {
  run(name, () => check(name, minutesToBurn(forest), expected));
}

run("large forest (should be instant)", () => {
  const row = "T".repeat(300);
  const forest = Array.from({ length: 300 }, (_, r) => (r === 0 ? "F" + row.slice(1) : row));
  const start = Date.now();
  const result = minutesToBurn(forest);
  const ms = Date.now() - start;
  check(`large forest (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: 598, fast: true });
});
