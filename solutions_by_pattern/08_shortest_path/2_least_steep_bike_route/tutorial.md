# Tutorial: Least Steep Bike Route

**Problem:** [problem.md](../../../problems_by_pattern/08_shortest_path/2_least_steep_bike_route/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#1631 Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)

Find the route from the top-left to the bottom-right whose **worst single step** is as gentle as possible.

---

## Step 1: Translate the story

- Each grid block is a **node**. Each block connects to its up-to-4 neighbours with an edge whose weight is `|height difference|`.
- A route's cost isn't the **sum** of its edges, but the **maximum** edge along it. This is called a **minimax** (or "bottleneck") path.

Why not plain DP (right and down only)? The best route can **wind** up, left and back. The `wall you must cross` and `detour beats the direct climb` tests both need routes that a "right/down only" DP can't express.

## Step 2: Does Dijkstra still work with `max`?

Dijkstra's "smallest popped is final" argument needs one property: **extending a route can never make it cheaper.**

- With `+` and weights ≥ 0: `cost + w ≥ cost` ✓
- With `max`: `max(cost, step) ≥ cost` ✓

So the argument goes through unchanged. **The only code change is one line:**

```js
const candidate = Math.max(steep, step);  // instead of steep + step
```

That's the main lesson of this problem: Dijkstra works for any route cost that **never decreases as the route gets longer**.

## Step 3: Trace the example

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
| (2, r2c2)         | **this is the destination, so return 2** ✓          | early exit                |

The flat-looking route along the top (1→2→2→2→5) has a final step of 3. The route down the left (1→3→5→3→5) never steps more than 2, so it wins.

**Early exit:** once the destination is **popped**, its value is final, so return immediately. Entries still in the heap (like 5 at r1c1, or the stale 3 at r2c2) don't matter.

## Step 4: Alternative, binary search on the answer

This connects back to [`03_binary_search`](../../03_binary_search/2_min_reading_speed/tutorial.md):

- Ask a yes/no question: *"Can I get from start to end using only steps ≤ X?"* Answer it with a plain BFS that ignores edges steeper than X.
- If X works, any bigger X works, so it's **monotonic**. Binary search X between 0 and (max height − min height).

That's O(R·C · log(range)). It's often easier to get right under pressure, and it's in [solution.js](solution.js) as `leastSteepRouteBinarySearch`.

**A third option:** sort all edges by steepness, then add them one by one with **Union-Find** until start and end are connected. The last edge added is the answer. (This is Kruskal's algorithm, stopped early.)

## Complexity

- **Dijkstra:** O(R·C · log(R·C)) time, O(R·C) space.
- **Binary search + BFS:** O(R·C · log H), where H is the height range.
- On the 200×200 test, both finish in tens of milliseconds.

## Pitfalls

- Using `+` instead of `max`, which solves a different problem (least *total* climbing).
- Treating only uphill as steep. It's `Math.abs`, as the `downhill counts too` test shows.
- Right/down-only DP: it fails on routes that wind.
- Returning when the destination is **pushed** rather than **popped**. A better route can still arrive later, as in the trace, where 3 improved to 2.

## Follow-up answers

1. **Why `max` is OK:** extending a route never lowers its max (Step 2). That's the same "never decreases" property that `+` with non-negative weights has.
2. **Binary search + BFS:** Step 4, O(R·C · log H).
3. **Union-Find:** process edges from gentlest to steepest. The first time start and end share a root, the current edge's steepness is the answer.
4. **The shortest of the least-steep routes:** use a pair as the cost, `[steepness, length]`, compared steepness first and then length. It still never decreases as the route grows, so Dijkstra still works. Just change the comparator.

## Say it in the interview

> "Model the grid as a graph where moving between neighbours costs the height difference. A route's cost is its steepest step, so it's a minimax path. Dijkstra still works because extending a route never lowers its max, so I run Dijkstra with max instead of plus, and return as soon as the bottom-right cell is popped. That's O(RC log RC). An alternative is binary searching the steepness limit with a BFS reachability check."
