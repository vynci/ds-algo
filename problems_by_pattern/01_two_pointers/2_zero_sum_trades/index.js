// Run: node index.js

function zeroSumTrios(trades) {
  // TODO
}

// ---- tests ----

// Order of triplets doesn't matter: sort both sides before comparing.
function checkUnordered(name, actual, expected) {
  const norm = (list) => (Array.isArray(list) ? list.map((x) => JSON.stringify(x)).sort() : list);
  const ok = JSON.stringify(norm(actual)) === JSON.stringify(norm(expected));
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) console.log(`      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`);
}

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
  ["example", [-1, 0, 1, 2, -1, -4], [[-1, -1, 2], [-1, 0, 1]]],
  ["no answer", [0, 1, 1], []],
  ["all zeros", [0, 0, 0], [[0, 0, 0]]],
  ["many zeros, still one triplet", [0, 0, 0, 0, 0], [[0, 0, 0]]],
  ["duplicate values in two triplets", [-2, 0, 1, 1, 2], [[-2, 0, 2], [-2, 1, 1]]],
  ["unsorted mix", [3, -1, -7, 2, 5, -4, 1], [[-4, -1, 5], [-7, 2, 5], [-4, 1, 3]]],
  ["heavy duplicates", [-1, -1, -1, 2, 2, 2, 0, 1, 1], [[-1, -1, 2], [-1, 0, 1]]],
  ["empty", [], []],
  ["too short", [1, -1], []],
];

for (const [name, trades, expected] of cases) {
  run(name, () => checkUnordered(name, zeroSumTrios(trades), expected));
}

run("does not mutate input", () => {
  const trades = [2, -1, -1];
  const result = zeroSumTrios(trades);
  check("does not mutate input", { result, trades }, { result: [[-1, -1, 2]], trades: [2, -1, -1] });
});
