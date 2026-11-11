// Run: node index.js

function findReading(readings, target) {
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
  ["example: found", [4, 5, 6, 7, 0, 1, 2], 0, 4],
  ["example: missing", [4, 5, 6, 7, 0, 1, 2], 3, -1],
  ["target is first", [4, 5, 6, 7, 0, 1, 2], 4, 0],
  ["target is last", [4, 5, 6, 7, 0, 1, 2], 2, 6],
  ["target just before seam", [4, 5, 6, 7, 0, 1, 2], 7, 3],
  ["not rotated", [1, 2, 3, 4, 5], 4, 3],
  ["rotated by one", [5, 1, 2, 3, 4], 5, 0],
  ["two elements, rotated", [3, 1], 1, 1],
  ["three elements", [5, 1, 3], 3, 2],
  ["single, found", [1], 1, 0],
  ["single, missing", [1], 0, -1],
  ["empty", [], 7, -1],
];

for (const [name, readings, target, expected] of cases) {
  run(name, () => check(name, findReading(readings, target), expected));
}

// Wraps an array so we can count how many elements your code reads.
function countingArray(arr) {
  const stats = { reads: 0 };
  const proxy = new Proxy(arr, {
    get(target, prop, receiver) {
      if (typeof prop === "string" && /^\d+$/.test(prop)) stats.reads++;
      return Reflect.get(target, prop, receiver);
    },
  });
  return { proxy, stats };
}

run("O(log n): reads at most 60 elements out of 100,000", () => {
  const n = 100000;
  const pivot = 37000;
  const sorted = Array.from({ length: n }, (_, i) => i * 2); // 0, 2, 4, ...
  const rotated = [...sorted.slice(pivot), ...sorted.slice(0, pivot)];
  const results = [];
  let maxReads = 0;
  for (const target of [0, 73998, 74000, 199998, 12346, 5]) {
    const { proxy, stats } = countingArray(rotated);
    results.push(findReading(proxy, target));
    maxReads = Math.max(maxReads, stats.reads);
  }
  check(
    `O(log n) (max reads: ${maxReads})`,
    { results, fewReads: maxReads <= 60 },
    { results: [63000, 99999, 0, 62999, 69173, -1], fewReads: true },
  );
});
