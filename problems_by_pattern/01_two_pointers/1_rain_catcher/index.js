// Run: node index.js

function maxWater(heights) {
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
  ["example", [1, 8, 6, 2, 5, 4, 8, 3, 7], 49],
  ["two posts", [1, 1], 1],
  ["equal ends win", [4, 3, 2, 1, 4], 16],
  ["middle is tallest", [1, 2, 1], 2],
  ["tall neighbours", [2, 3, 4, 5, 18, 17, 6], 17],
  ["zero-height post", [0, 5, 0], 0],
  ["no posts", [], 0],
  ["one post", [5], 0],
];

for (const [name, heights, expected] of cases) {
  run(name, () => check(name, maxWater(heights), expected));
}

run("large input (should be instant)", () => {
  const heights = Array.from({ length: 50000 }, (_, i) => (i * 7919) % 10007);
  const start = Date.now();
  const result = maxWater(heights);
  const ms = Date.now() - start;
  check(`large input (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: 495768979, fast: true });
});
