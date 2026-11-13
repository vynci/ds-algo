# Tutorial: Least Steep Bike Route

**Problem:** [problem.md](../../../problems_by_pattern/08_shortest_path/2_least_steep_bike_route/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#1631 Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/). **Background:** [Dijkstra explained](../dijkstra_explained.md)

Find the route from the top-left to the bottom-right whose **worst single step** is as gentle as possible.

---

## Step 1: Translate the story

Before writing any code, rephrase the story in graph terms:

| Story                          | Graph term                                                    |
| ------------------------------ | ------------------------------------------------------------- |
| A block `heights[r][c]`        | A **node** `(r, c)`                                           |
| Riding to an adjacent block    | An **edge** to one of up to 4 neighbours                      |
| The elevation change           | The edge **weight**: `Math.abs(heights[a] - heights[b])`      |
| A route's steepness            | The **maximum** edge weight along the path, not the sum       |
| "Least steep route"            | The path whose maximum edge is smallest: a **minimax path**   |

**Why not a simple DP** that only moves right and down? Because the best route can **wind**: up, left and back around obstacles. The `wall you must cross` and `detour beats the direct climb` tests need routes that a right/down-only DP can't produce. Any time paths can go in **all directions** and you want the "cheapest", think **graph search**.

## Step 2: Does Dijkstra still work with `max`?

Dijkstra rests on one fact: **when a node is popped from the heap, its cost is final.** That fact needs exactly one property: **extending a route can never make it cheaper.**

- Normal Dijkstra, with `+` and weights ≥ 0: `cost + w ≥ cost` ✓
- This problem, with `max`: `max(cost, step) ≥ cost` ✓

So the proof still holds, and the algorithm is the same Dijkstra with **one line changed**:

```js
const candidate = Math.max(steep, step); // instead of steep + step
```

> **The main lesson:** Dijkstra works for any route cost that **never decreases as the route gets longer**. Sums of non-negative weights, maximums, and tuples like `[cost, length]` all qualify.

---

## Step 3: Write the solution, piece by piece

This is the actual process: plan first, then fill in one small block at a time, and know *why* each line is there.

### 3.1 Start from the plan, written as comments

In an interview, write the skeleton as comments first. It shows the interviewer your plan, and it stops you getting lost halfway through.

```js
function leastSteepRoute(heights) {
  // 1. grid size
  // 2. best-known steepness for every cell (start = 0, others = Infinity)
  // 3. min-heap of [steepness, r, c], seeded with the start
  // 4. loop: pop the least steep cell
  //    a. skip it if stale
  //    b. if it's the destination, return (popped = final)
  //    c. for each of the 4 neighbours:
  //         - skip if off the grid
  //         - cost through here = max(current steepness, this step)
  //         - if better than known: record it, push it
}
```

Each numbered comment becomes a few lines of code below. Compare this with the template in [Dijkstra explained, section 8](../dijkstra_explained.md#8-implementation-in-javascript): it's the same shape. The only differences are that **nodes are grid cells** and **the cost uses `max`**.

### 3.2 Directions: how to find neighbours

Grids don't come with an edge list, so you **generate neighbours on the fly**. A direction table keeps it to one loop instead of four copy-pasted blocks:

```js
const DIRECTIONS = [
  [1, 0],  // down
  [-1, 0], // up
  [0, 1],  // right
  [0, -1], // left
];
```

Later, `for (const [dr, dc] of DIRECTIONS)` turns `(r, c)` into each neighbour `(r + dr, c + dc)`. Diagonals aren't allowed in this problem, so there are 4 entries, not 8.

### 3.3 Grid size

```js
const rows = heights.length;
const cols = heights[0].length;
```

The problem guarantees at least one block, so `heights[0]` is safe. If it didn't, you'd guard with `if (rows === 0) return 0;` and say so out loud.

### 3.4 The "best known so far" table

```js
// steepest[r][c] = the least steep route found SO FAR from the start to (r, c)
const steepest = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
steepest[0][0] = 0;
```

- This is Dijkstra's `dist` table, shaped like the grid.
- **`Infinity`** means "no route found yet". Any real route beats it, so the first comparison always succeeds.
- **The start is 0**: you're already there, so you haven't taken any steps.

> ⚠️ **A JS trap:** `new Array(rows).fill(new Array(cols).fill(Infinity))` looks equivalent, but it puts the **same row array** in every slot. Changing `steepest[1][0]` would change every row. `Array.from({ length }, () => ...)` creates a **new** row each time.

### 3.5 The heap, seeded with the start

```js
const heap = new MinHeap((a, b) => a[0] - b[0]); // entries: [steepness, r, c]
heap.push([0, 0, 0]);
```

- Each heap entry is a small array: `[steepness, row, col]`.
- The comparator looks at index `0` only, the steepness. That makes the heap always hand back the **least steep frontier cell**.
- `MinHeap` is the class from [`07_heap/1_kth_largest_upload`](../../07_heap/1_kth_largest_upload/solution.js). JS has no built-in heap.

### 3.6 The main loop: pop, skip stale entries, early exit

```js
while (heap.size > 0) {
  const [steep, r, c] = heap.pop();

  if (steep > steepest[r][c]) continue; // (a) stale entry

  if (r === rows - 1 && c === cols - 1) return steep; // (b) destination popped means final

  // (c) neighbours: next step
}
```

**(a) Why entries go stale.** The same cell can be pushed more than once, first with a worse value and later with a better one, because JS heaps can't update an entry in place. When the old, worse entry finally comes out, `steepest[r][c]` already holds something smaller, so we skip it. Without this line the answer is still right, but you waste time re-exploring from outdated values.

**(b) Why it's safe to return here.** Everything still in the heap has steepness ≥ `steep`, and extending a route never lowers its max (Step 2). So nothing left can reach the destination more gently. Return on **pop**, not on push: when the destination is first *pushed* its value may still improve. In the trace below it goes from 3 to 2.

### 3.7 Visit the neighbours

```js
for (const [dr, dc] of DIRECTIONS) {
  const nr = r + dr;
  const nc = c + dc;
  if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue; // off the grid

  // the cost calculation and relax step go here
}
```

The bounds check comes first. Reading `heights[-1]` gives `undefined`, and `heights[-1][0]` **throws**.

Notice that we **don't** skip cells we've already visited. Dijkstra doesn't need a separate `visited` set: the `steepest` table plus the stale check do that job. A neighbour that's already final simply won't improve, so nothing gets pushed.

### 3.8 The one-line change, plus the relax step

```js
const step = Math.abs(heights[nr][nc] - heights[r][c]); // this edge's weight (up OR down)
const candidate = Math.max(steep, step);                 // route steepness if we go via (r, c)

if (candidate < steepest[nr][nc]) { // found a gentler way to reach the neighbour
  steepest[nr][nc] = candidate;     // remember it
  heap.push([candidate, nr, nc]);   // and put it on the frontier
}
```

- **`Math.abs`**: downhill is as steep as uphill. The `downhill counts too` test checks this.
- **`Math.max(steep, step)`**: the route so far had worst step `steep`. Adding this step, the new worst step is whichever is bigger. **This is the only line that differs from textbook Dijkstra** (`steep + step`).
- **`<`, not `<=`**: pushing an equal value would only add duplicate work.
- We **update the table before pushing**, so later relaxations compare against the improved value straight away.

### 3.9 After the loop

```js
// Not reached in practice: every cell in a grid is reachable, so the loop returns above.
return steepest[rows - 1][cols - 1];
```

In a grid with 4-way moves and no walls, the destination is always reachable, so 3.6(b) always returns first. The line is there so the function always returns *something* if the problem changes, for example if walls are added later.

### 3.10 Put it all together

```js
const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function leastSteepRoute(heights) {
  const rows = heights.length;
  const cols = heights[0].length;

  const steepest = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  steepest[0][0] = 0;

  const heap = new MinHeap((a, b) => a[0] - b[0]); // [steepness, r, c]
  heap.push([0, 0, 0]);

  while (heap.size > 0) {
    const [steep, r, c] = heap.pop();
    if (steep > steepest[r][c]) continue;                  // stale
    if (r === rows - 1 && c === cols - 1) return steep;    // destination popped = final

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      const step = Math.abs(heights[nr][nc] - heights[r][c]);
      const candidate = Math.max(steep, step);             // max, not +
      if (candidate < steepest[nr][nc]) {
        steepest[nr][nc] = candidate;
        heap.push([candidate, nr, nc]);
      }
    }
  }
  return steepest[rows - 1][cols - 1];
}
```

That's about 25 lines, and every one maps back to a comment from 3.1. This is the same code as [solution.js](solution.js), with shorter comments.

### 3.11 Check it before running

Run through the small cases in your head first. Interviewers like to see this.

| Input            | Walk-through                                                         | Expected |
| ---------------- | -------------------------------------------------------------------- | -------- |
| `[[7]]`          | Push `[0,0,0]`. Pop it: it's the destination, so return 0            | 0 ✓      |
| `[[1, 10]]`      | Pop the start, relax right: `max(0, 9) = 9`. Pop `(9, 0, 1)`: destination | 9 ✓ |
| `[[10], [1]]`    | Downhill: `abs(1 - 10) = 9`                                          | 9 ✓      |

Then trace the real example (Step 4).

---

## Step 4: Trace the example

```
     c0  c1  c2
r0    1   2   2
r1    3   8   2
r2    5   3   5
```

| pop (steep, cell) | relax neighbours: max(steep, step)                  | notes                     |
| ----------------- | --------------------------------------------------- | ------------------------- |
| (0, r0c0)         | r0c1: max(0, 1) = 1; r1c0: max(0, 2) = 2            |                           |
| (1, r0c1)         | r0c2: max(1, 0) = 1; r1c1: max(1, 6) = 6            |                           |
| (1, r0c2)         | r1c2: max(1, 0) = 1                                 |                           |
| (1, r1c2)         | r2c2: max(1, 3) = **3**; r1c1: max(1, 6) = 6, no better | the destination is at 3 for now |
| (2, r1c0)         | r2c0: max(2, 2) = 2; r1c1: max(2, 5) = **5** < 6    | r1c1 improved             |
| (2, r2c0)         | r2c1: max(2, 2) = 2                                 |                           |
| (2, r2c1)         | r2c2: max(2, 2) = **2** < 3                         | the destination improved! |
| (2, r2c2)         | **this is the destination, so return 2** ✓          | early exit (3.6b)         |

The flat-looking route along the top (1→2→2→2→5) has a final step of 3. The route down the left (1→3→5→3→5) never steps more than 2, so it wins.

When we return, the heap still holds the old `(3, r2c2)` and `(5, r1c1)` entries. They don't matter: the destination was popped with 2, and nothing left can beat it.

---

## Step 5: Alternative, binary search on the answer (built step by step)

This connects back to [`03_binary_search`](../../03_binary_search/2_min_reading_speed/tutorial.md). It's often easier to get right under pressure, because each piece is simple.

### 5.1 Turn "minimize" into a yes/no question

Instead of *"what's the least steep route?"*, ask: **"Can I get from start to end using only steps ≤ `limit`?"**

- If `limit` works, any bigger `limit` works too, since it allows the same routes and more. So the answers look like `no no no YES YES YES`.
- Binary search finds the **first YES**, and that's the answer.

### 5.2 The yes/no check: plain BFS that refuses steep steps

```js
const canReach = (limit) => {
  const seen = new Uint8Array(rows * cols); // a flat visited grid: (r, c) is at index r * cols + c
  const queue = [[0, 0]];
  seen[0] = 1;

  for (let head = 0; head < queue.length; head++) { // head pointer instead of shift()
    const [r, c] = queue[head];
    if (r === rows - 1 && c === cols - 1) return true; // reached the destination

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (seen[nr * cols + nc]) continue;
      if (Math.abs(heights[nr][nc] - heights[r][c]) > limit) continue; // too steep: this edge doesn't exist
      seen[nr * cols + nc] = 1;
      queue.push([nr, nc]);
    }
  }
  return false; // explored everything reachable, and the destination wasn't in it
};
```

This is ordinary reachability. The only twist is that **edges steeper than `limit` don't exist**. DFS would work just as well, because we only care *whether* we can reach the end, not how far it is.

### 5.3 The bounds for the search

```js
let lo = 0; // a perfectly flat route is the best possible
let hi = Math.max(...heights.flat()) - Math.min(...heights.flat()); // no step can be steeper than this
```

`hi` must be a value we **know** works. With `limit` = the whole height range, every step is allowed, so `canReach(hi)` is always true.

### 5.4 The binary search, "find the first YES"

```js
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (canReach(mid)) hi = mid; // mid works, so the answer is mid or smaller (keep mid)
  else lo = mid + 1;           // mid fails, so the answer is bigger
}
return lo;
```

This is the same template as Minimum Reading Speed. `hi = mid` keeps a working value in range, and `lo = mid + 1` throws away a failing one. When `lo === hi`, that's the smallest working limit.

### 5.5 Assembled

The full function is in [solution.js](solution.js) as `leastSteepRouteBinarySearch`. It's 5.2, 5.3 and 5.4 placed inside one function. It was checked against the Dijkstra version on 205 random grids, and they always agree.

**A third option:** sort all edges by steepness, then add them one by one with **Union-Find** until start and end are connected. The last edge added is the answer. (This is Kruskal's algorithm, stopped early.)

---

## Complexity

- **Dijkstra:** O(R·C · log(R·C)) time, since each cell is pushed a few times at most and each push or pop is a log. O(R·C) space for `steepest` and the heap.
- **Binary search + BFS:** O(R·C · log H), where H is the height range: about 10 BFS runs for heights under 1,000.
- On the 200×200 test, both finish in tens of milliseconds.

## Pitfalls

| Mistake | Symptom | Fix |
| --- | --- | --- |
| `+` instead of `max` | Solves "least total climbing", a different problem | `Math.max(steep, step)` (3.8) |
| No `Math.abs` | Downhill steps count as negative | `Math.abs(...)` (3.8) |
| Right/down-only DP | Fails when the route has to wind | Graph search (Step 1) |
| Return when the destination is **pushed** | Returns 3 instead of 2 on the example | Return on **pop** (3.6b) |
| `fill(new Array(...))` for the table | Every row is the same array | `Array.from({ length }, () => ...)` (3.4) |
| A `visited` set marked on push | Locks in the first, worse value | Use `steepest` + the stale check (3.7) |

## Follow-up answers

1. **Why `max` is OK:** extending a route never lowers its max (Step 2). That's the same "never decreases" property that `+` with non-negative weights has.
2. **Binary search + BFS:** Step 5, O(R·C · log H).
3. **Union-Find:** process edges from gentlest to steepest. The first time start and end share a root, the current edge's steepness is the answer.
4. **The shortest of the least-steep routes:** make the cost a pair, `[steepness, length]`. Compare by steepness, then length: the comparator becomes `(a, b) => a[0] - b[0] || a[1] - b[1]`, and the relax step becomes `[Math.max(steep, step), length + 1]`. The pair still never decreases as the route grows, so Dijkstra still works.

## Say it in the interview

> "Model the grid as a graph where moving between neighbours costs the height difference. A route's cost is its steepest step, so it's a minimax path. Dijkstra still works because extending a route never lowers its max, so I run Dijkstra with max instead of plus, and return as soon as the bottom-right cell is popped. That's O(RC log RC). An alternative is binary searching the steepness limit with a BFS reachability check."
