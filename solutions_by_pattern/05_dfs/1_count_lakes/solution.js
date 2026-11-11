// Run: node solution.js
// Count the Lakes (LeetCode #200 Number of Islands + #695 Max Area of Island). See tutorial.md.

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function surveyLakes(map) {
  const rows = map.length;
  const cols = rows > 0 ? map[0].length : 0;
  const visited = new Uint8Array(rows * cols); // a flat grid of 0/1 flags, cell (r, c) at r * cols + c

  let count = 0;
  let largest = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (map[r][c] !== "~" || visited[r * cols + c]) continue;

      // Unvisited water: a NEW lake. Flood-fill it and measure its size.
      count++;
      largest = Math.max(largest, floodFill(map, visited, r, c, rows, cols));
    }
  }

  return { count, largest };
}

// Iterative DFS with an explicit stack. Recursion would overflow on a 300x300 lake
// (90,000 nested calls), but an array can hold 90,000 entries easily.
function floodFill(map, visited, startR, startC, rows, cols) {
  const stack = [[startR, startC]];
  visited[startR * cols + startC] = 1; // mark when PUSHING, so a cell never goes on the stack twice
  let size = 0;

  while (stack.length > 0) {
    const [r, c] = stack.pop(); // pop() = last in, first out = depth-first
    size++;

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (map[nr][nc] !== "~") continue;
      const key = nr * cols + nc;
      if (visited[key]) continue;
      visited[key] = 1;
      stack.push([nr, nc]);
    }
  }

  return size;
}

// For reference: the recursive version you'd usually write first.
// It's correct, but it throws "Maximum call stack size exceeded" on the giant-lake test.
function floodFillRecursive(map, visited, r, c, rows, cols) {
  if (r < 0 || c < 0 || r >= rows || c >= cols) return 0;
  if (map[r][c] !== "~" || visited[r * cols + c]) return 0;
  visited[r * cols + c] = 1; // mark BEFORE recursing, or neighbours bounce back forever
  return (
    1 +
    floodFillRecursive(map, visited, r + 1, c, rows, cols) +
    floodFillRecursive(map, visited, r - 1, c, rows, cols) +
    floodFillRecursive(map, visited, r, c + 1, rows, cols) +
    floodFillRecursive(map, visited, r, c - 1, rows, cols)
  );
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
  ["example", ["~~#", "~##", "#~~"], { count: 2, largest: 3 }],
  ["all land", ["###", "###"], { count: 0, largest: 0 }],
  ["single water cell", ["~"], { count: 1, largest: 1 }],
  ["diagonals don't connect", ["~#", "#~"], { count: 2, largest: 1 }],
  ["empty map", [], { count: 0, largest: 0 }],
  ["U-shaped lake is one lake", ["~#~", "~#~", "~~~"], { count: 1, largest: 7 }],
  [
    "several lakes",
    ["~~##~", "~###~", "##~##", "~####", "~~#~~"],
    { count: 5, largest: 3 },
  ],
  ["ring of water around an island", ["~~~~", "~##~", "~~~~"], { count: 1, largest: 10 }],
];

for (const [name, map, expected] of cases) {
  run(name, () => check(name, surveyLakes(map), expected));
}

run("one giant lake, 300x300 (recursion depth trap)", () => {
  const map = Array.from({ length: 300 }, () => "~".repeat(300));
  check("one giant lake, 300x300 (recursion depth trap)", surveyLakes(map), { count: 1, largest: 90000 });
});
