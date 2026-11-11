// Run: node solution.js
// Wildfire Spread (LeetCode #994 Rotting Oranges). See tutorial.md.

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function minutesToBurn(forest) {
  const rows = forest.length;
  const cols = rows > 0 ? forest[0].length : 0;

  // Strings are immutable, so track burning cells separately. Key a cell as r * cols + c.
  const burning = new Set();
  let queue = []; // the cells that caught fire during the current minute
  let healthy = 0;

  // 1. Collect EVERY starting fire (multi-source), and count the healthy trees.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (forest[r][c] === "F") {
        queue.push([r, c]);
        burning.add(r * cols + c);
      } else if (forest[r][c] === "T") {
        healthy++;
      }
    }
  }

  // 2. BFS one minute (one level) at a time, while there are fires AND trees left to burn.
  let minutes = 0;
  while (queue.length > 0 && healthy > 0) {
    const next = [];
    for (const [r, c] of queue) {
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue; // off the map
        if (forest[nr][nc] !== "T") continue; // bare ground, or already a fire at the start
        const key = nr * cols + nc;
        if (burning.has(key)) continue; // caught fire earlier

        burning.add(key); // mark when it CATCHES fire (enqueue time), not when processed
        healthy--;
        next.push([nr, nc]);
      }
    }
    queue = next;
    minutes++;
  }

  // 3. If any tree never caught fire, it's unreachable.
  return healthy === 0 ? minutes : -1;
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
