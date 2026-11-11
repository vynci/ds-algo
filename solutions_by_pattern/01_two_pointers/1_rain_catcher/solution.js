// Run: node solution.js
// Rain Catcher (LeetCode #11 Container With Most Water). See tutorial.md for the walkthrough.

function maxWater(heights) {
  let left = 0;
  let right = heights.length - 1;
  let best = 0;

  // Start with the WIDEST pair and move inward. Every move loses 1 unit of width,
  // so the only way to do better is to find a taller "short side".
  while (left < right) {
    const width = right - left;
    const height = Math.min(heights[left], heights[right]); // the shorter post caps the water
    best = Math.max(best, width * height);

    // Move the SHORTER post. Pairing it with anything closer is narrower AND
    // still capped by the same short post, so it can never beat what we just measured.
    if (heights[left] < heights[right]) {
      left++;
    } else {
      right--; // on a tie, either move is safe
    }
  }

  return best; // 0 when there are fewer than 2 posts (the loop never runs)
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
