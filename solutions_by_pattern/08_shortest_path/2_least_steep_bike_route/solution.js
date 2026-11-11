// Run: node solution.js
// Least Steep Bike Route (LeetCode #1631 Path With Minimum Effort). See tutorial.md.

// The same MinHeap as in 07_heap.
class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.compare = compare;
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  peek() {
    return this.items[0];
  }
  push(value) {
    const items = this.items;
    items.push(value);
    let i = items.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(items[i], items[parent]) >= 0) break;
      [items[i], items[parent]] = [items[parent], items[i]];
      i = parent;
    }
  }
  pop() {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let best = i;
        if (l < items.length && this.compare(items[l], items[best]) < 0) best = l;
        if (r < items.length && this.compare(items[r], items[best]) < 0) best = r;
        if (best === i) break;
        [items[i], items[best]] = [items[best], items[i]];
        i = best;
      }
    }
    return top;
  }
}

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function leastSteepRoute(heights) {
  const rows = heights.length;
  const cols = heights[0].length;

  // steepest[r][c] = the least steep route found so far from the start to (r, c)
  const steepest = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  steepest[0][0] = 0;

  const heap = new MinHeap((a, b) => a[0] - b[0]); // entries: [steepness, r, c]
  heap.push([0, 0, 0]);

  while (heap.size > 0) {
    const [steep, r, c] = heap.pop();
    if (steep > steepest[r][c]) continue; // stale entry

    // Popped means final. If it's the destination, we're done: nothing left can be less steep.
    if (r === rows - 1 && c === cols - 1) return steep;

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      // THE ONE CHANGE from normal Dijkstra: a route's cost is its WORST step, so use max, not +.
      const step = Math.abs(heights[nr][nc] - heights[r][c]);
      const candidate = Math.max(steep, step);

      if (candidate < steepest[nr][nc]) {
        steepest[nr][nc] = candidate;
        heap.push([candidate, nr, nc]);
      }
    }
  }

  // Not reached in practice: every cell in a grid is reachable, so the loop always returns above.
  return steepest[rows - 1][cols - 1];
}

// ---------------------------------------------------------------------------
// Alternative: binary search on the answer + BFS (it ties back to 03_binary_search).
// "Can I reach the end using only steps <= limit?" is monotonic in `limit`.
// O(R*C * log(maxHeight)).

function leastSteepRouteBinarySearch(heights) {
  const rows = heights.length;
  const cols = heights[0].length;

  const canReach = (limit) => {
    const seen = new Uint8Array(rows * cols);
    const queue = [[0, 0]];
    seen[0] = 1;
    for (let head = 0; head < queue.length; head++) {
      const [r, c] = queue[head];
      if (r === rows - 1 && c === cols - 1) return true;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr * cols + nc]) continue;
        if (Math.abs(heights[nr][nc] - heights[r][c]) > limit) continue; // too steep for this limit
        seen[nr * cols + nc] = 1;
        queue.push([nr, nc]);
      }
    }
    return false;
  };

  let lo = 0;
  let hi = Math.max(...heights.flat()) - Math.min(...heights.flat()); // no step is steeper than this
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canReach(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
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
  ["example", [[1, 2, 2], [3, 8, 2], [5, 3, 5]], 2],
  ["detour beats the direct climb", [[1, 2, 3], [3, 8, 4], [5, 3, 5]], 1],
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
  ["wall you must cross", [[1, 1, 1], [9, 9, 9], [1, 1, 1]], 8],
];

for (const [name, heights, expected] of cases) {
  run(name, () => check(name, leastSteepRoute(heights), expected));
}

run("large city: 200 x 200 (should be instant)", () => {
  let seed = 7;
  const rand = () => (seed = (seed * 48271) % 2147483647);
  const heights = Array.from({ length: 200 }, () => Array.from({ length: 200 }, () => rand() % 1000));
  const start = Date.now();
  const result = leastSteepRoute(heights);
  const ms = Date.now() - start;
  check(`large city (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: 339, fast: true });
});
