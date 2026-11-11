// Run: node solution.js
// Zero-Sum Trades (LeetCode #15 3Sum). See tutorial.md for the walkthrough.

function zeroSumTrios(trades) {
  // Sort a COPY. sort() mutates, and the caller's array must not change.
  const sorted = [...trades].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    const a = sorted[i];

    // Early exit: if the smallest of the three is positive, the sum can't be 0.
    if (a > 0) break;

    // Duplicate skip #1: the same `a` would produce the same triplets again.
    if (i > 0 && a === sorted[i - 1]) continue;

    // Now it's "two-sum in a sorted array": find b + c === -a in sorted[i+1 .. end].
    let left = i + 1;
    let right = sorted.length - 1;

    while (left < right) {
      const sum = a + sorted[left] + sorted[right];

      if (sum === 0) {
        result.push([a, sorted[left], sorted[right]]);
        left++;
        right--;
        // Duplicate skip #2: step past repeated `b` values so we don't record the same triplet.
        while (left < right && sorted[left] === sorted[left - 1]) left++;
      } else if (sum < 0) {
        left++; // too small, so we need a bigger b
      } else {
        right--; // too big, so we need a smaller c
      }
    }
  }

  return result;
}

// ---- tests (identical to the problem's index.js) ----

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
