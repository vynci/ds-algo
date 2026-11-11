// Run: node index.js

function workoutPlans(blocks, minutes) {
  // TODO
}

// ---- tests ----

// Order doesn't matter anywhere: sort inside each plan, then sort the plans.
// Duplicate plans (like [2,3] and [3,2]) still fail, because the counts differ.
function checkPlans(name, actual, expected) {
  const norm = (list) =>
    Array.isArray(list) ? list.map((plan) => JSON.stringify([...plan].sort((a, b) => a - b))).sort() : list;
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
  ["example 1", [2, 3, 6, 7], 7, [[2, 2, 3], [7]]],
  ["example 2", [2, 3, 5], 8, [[2, 2, 2, 2], [2, 3, 3], [3, 5]]],
  ["nothing fits", [2], 1, []],
  ["reuse one block", [1], 3, [[1, 1, 1]]],
  ["no duplicate plans", [2, 3], 5, [[2, 3]]],
  ["unsorted blocks", [10, 5, 15], 20, [[5, 5, 5, 5], [5, 5, 10], [5, 15], [10, 10]]],
  ["blocks bigger than target", [8, 9, 10], 7, []],
];

for (const [name, blocks, minutes, expected] of cases) {
  run(name, () => checkPlans(name, workoutPlans(blocks, minutes), expected));
}

run("a full hour from common blocks", () => {
  const plans = workoutPlans([5, 10, 15, 20, 30], 60);
  const unique = new Set(plans.map((p) => JSON.stringify([...p].sort((a, b) => a - b))));
  const allValid = plans.every((p) => p.reduce((s, x) => s + x, 0) === 60);
  check("a full hour from common blocks", { total: plans.length, unique: unique.size, allValid }, { total: 44, unique: 44, allValid: true });
});

run("does not mutate blocks", () => {
  const blocks = [7, 3, 2, 6];
  const plans = workoutPlans(blocks, 7);
  check("does not mutate blocks", { count: plans.length, blocks }, { count: 2, blocks: [7, 3, 2, 6] });
});
