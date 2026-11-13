// Run: node index.js

// Paste your MinHeap from ../../07_heap/1_kth_largest_upload/index.js here.
class MinHeap {
  // TODO
}

function leastSteepRoute(heights) {
  let result = [];

  // TODO
  return 2;
}

console.log(
  leastSteepRoute([
    [1, 2, 2],
    [3, 8, 2],
    [5, 3, 5],
  ]),
);

// ---- tests ----

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok)
    console.log(
      `      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`,
    );
}

function run(name, fn) {
  try {
    fn();
  } catch (err) {
    console.log(`FAIL  ${name} (threw: ${err.message})`);
  }
}

const cases = [
  [
    "example",
    [
      [1, 2, 2],
      [3, 8, 2],
      [5, 3, 5],
    ],
    2,
  ],
  [
    "detour beats the direct climb",
    [
      [1, 2, 3],
      [3, 8, 4],
      [5, 3, 5],
    ],
    1,
  ],
  [
    "a perfectly flat route exists",
    [
      [1, 2, 1, 1, 1],
      [1, 2, 1, 2, 1],
      [1, 2, 1, 2, 1],
      [1, 2, 1, 2, 1],
      [1, 1, 1, 2, 1],
    ],
    0,
  ],
  ["single block", [[7]], 0],
  ["two blocks", [[1, 10]], 9],
  ["downhill counts too", [[10], [1]], 9],
  ["one column", [[3], [5], [4], [9]], 5],
  [
    "wall you must cross",
    [
      [1, 1, 1],
      [9, 9, 9],
      [1, 1, 1],
    ],
    8,
  ],
];

// for (const [name, heights, expected] of cases) {
//   run(name, () => check(name, leastSteepRoute(heights), expected));
// }

// run("large city: 200 x 200 (should be instant)", () => {
//   let seed = 7;
//   const rand = () => (seed = (seed * 48271) % 2147483647);
//   const heights = Array.from({ length: 200 }, () =>
//     Array.from({ length: 200 }, () => rand() % 1000),
//   );
//   const start = Date.now();
//   const result = leastSteepRoute(heights);
//   const ms = Date.now() - start;
//   check(
//     `large city (${ms}ms, should be well under 1000ms)`,
//     { result, fast: ms < 1000 },
//     { result: 339, fast: true },
//   );
// });
