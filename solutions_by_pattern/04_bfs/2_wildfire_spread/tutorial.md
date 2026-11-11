# Tutorial: Wildfire Spread

**Problem:** [problem.md](../../../problems_by_pattern/04_bfs/2_wildfire_spread/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#994 Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)

Every minute, fire spreads to the adjacent trees. How long until all of them burn?

---

## Step 1: Recognize BFS

"Every minute it spreads one step to its neighbours" means BFS **levels**, where one level is one minute. A tree's burn time is its **shortest distance** (in steps) from *any* fire.

## Step 2: The key idea, multi-source BFS

There can be **several** fires at the start, and they all spread **simultaneously**. The tempting mistake is to run a separate BFS from each fire and combine the results. That's slow (O(fires × cells)), and easy to get wrong.

Instead, **put every starting fire in the queue at minute 0.** BFS then expands all of them together, like ripples from several stones dropped at once. Each tree is reached first by its **nearest** fire, which is exactly when it would really catch fire.

```
"FTTTF"   (two fires, one at each end)

minute 0:  F T T T F
minute 1:  F F T F F    <- both fires spread at once
minute 2:  F F F F F    -> answer 2 (spreading from only the left fire gives 3)
```

## Step 3: Counting what's left

How do we know at the end whether some tree **never** burned? Count the healthy trees at the start, and decrement each time one catches fire. If the count is still above 0 when the queue runs dry, return -1. That avoids a second scan of the grid.

Edge cases fall out naturally:

- **No trees at all:** `healthy` starts at 0, the loop doesn't run, and you return `0`.
- **Trees but no fire:** the queue is empty, the loop doesn't run, `healthy > 0`, and you return `-1`.

## Step 4: Trace the example

```
F T T
T T .
. T T
```

| minute | catch fire this minute | healthy left |
| ------ | ---------------------- | ------------ |
| 0      | start: fire at (0,0)   | 6            |
| 1      | (0,1), (1,0)           | 4            |
| 2      | (0,2), (1,1)           | 2            |
| 3      | (2,1)                  | 1            |
| 4      | (2,2)                  | **0**, so stop |

The answer is **4** ✓

Note the loop condition `healthy > 0`. We stop as soon as the last tree catches fire, so we don't count an extra empty minute at the end. That's a classic off-by-one in this problem.

## Step 5: Mark when you enqueue

A tree is added to `burning` **the moment it's discovered**, not when it's processed. Otherwise two fires next to the same tree would both enqueue it in the same minute. Then `healthy--` runs twice for one tree, the count goes wrong, and the queue fills with duplicates. That's the classic BFS bug that blows up run time.

## Complexity

- **Time O(rows × cols):** each cell is enqueued at most once and checks 4 neighbours.
- **Space O(rows × cols):** for `burning` and the queue.

## Pitfalls

- Running BFS per fire (Step 2). The `"FTTTF"` test catches it.
- Counting one extra minute after the last tree burns.
- Diagonal spread. The `"diagonal does not spread"` test catches it.
- Using arrays as `Set` keys: `[1, 2] !== [1, 2]`. Use `r * cols + c`, or the string `"r,c"`.

## Follow-up answers

1. **Why per-fire BFS is wrong:** each tree burns at its distance to the **nearest** fire. A BFS from one fire only knows its *own* distances. On `"FTTTF"`, the BFS from the left fire says the far tree burns at minute 3, when the right fire reaches it at minute 1. You *could* fix that by taking the minimum per tree across every BFS, but that costs O(fires × cells). Multi-source BFS gets the nearest-fire distance for every tree in one pass.
2. **Immutable strings:** either copy to `forest.map((row) => [...row])` and overwrite cells, or keep a `Set`, as here. The `Set` leaves the input untouched.
3. **8 directions:** add the four diagonal offsets to `DIRECTIONS`. Nothing else changes.

## Say it in the interview

> "Spreading one step per minute is BFS by levels. Since all fires spread simultaneously, I seed the queue with every fire at once (multi-source BFS), count the healthy trees up front, and process one minute per level, decrementing as trees catch fire. When the queue empties, if trees remain they're unreachable, so I return -1. O(rows × cols)."
