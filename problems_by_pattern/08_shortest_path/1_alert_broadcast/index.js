// Run: node index.js

// Paste your MinHeap from ../../07_heap/1_kth_largest_upload/index.js here.
class MinHeap {
  // TODO
}

function broadcastTime(towns, relays, source) {
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
  ["example", ["A", "B", "C", "D"], [["B", "A", 1], ["B", "C", 1], ["C", "D", 1]], "B", 2],
  ["single relay", ["A", "B"], [["A", "B", 1]], "A", 1],
  ["relays are one-way", ["A", "B"], [["A", "B", 1]], "B", -1],
  ["single town", ["Solo"], [], "Solo", 0],
  ["cheaper route with more hops", ["A", "B", "C"], [["A", "C", 10], ["A", "B", 2], ["B", "C", 3]], "A", 5],
  ["don't finalize on push", ["A", "B", "C"], [["A", "C", 5], ["A", "B", 1], ["B", "C", 1]], "A", 2],
  ["parallel relays: use the fastest", ["A", "B"], [["A", "B", 5], ["A", "B", 2]], "A", 2],
  ["zero-minute relay", ["A", "B", "C"], [["A", "B", 0], ["B", "C", 4]], "A", 4],
  ["cycle", ["A", "B", "C"], [["A", "B", 1], ["B", "A", 1], ["B", "C", 4]], "A", 5],
  ["isolated town", ["A", "B", "C"], [["A", "B", 3]], "A", -1],
  [
    "slowest town is not the farthest in hops",
    ["HQ", "N", "S", "E", "W"],
    [["HQ", "N", 2], ["HQ", "S", 9], ["N", "E", 2], ["E", "W", 2]],
    "HQ",
    9,
  ],
];

for (const [name, towns, relays, source, expected] of cases) {
  run(name, () => check(name, broadcastTime(towns, relays, source), expected));
}

run("large network: 20,000 towns, 80,000 relays (should be instant)", () => {
  let seed = 2024;
  const rand = () => (seed = (seed * 48271) % 2147483647);
  const n = 20000;
  const towns = Array.from({ length: n }, (_, i) => `t${i}`);
  const relays = [];
  for (let i = 0; i + 1 < n; i++) relays.push([towns[i], towns[i + 1], 1 + (rand() % 100)]);
  for (let j = 0; j < 60001; j++) relays.push([towns[rand() % n], towns[rand() % n], 1 + (rand() % 1000)]);
  const start = Date.now();
  const result = broadcastTime(towns, relays, "t0");
  const ms = Date.now() - start;
  check(`large network (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: 1532, fast: true });
});
