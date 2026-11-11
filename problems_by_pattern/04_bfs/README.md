# BFS (Breadth-First Search)

## The idea

Explore a graph **in rings**: first everything 1 step from the start, then everything 2 steps away, and so on. A **queue** (first in, first out) makes that happen. Because of this, BFS answers two kinds of question naturally:

1. **"What's on each level?"** Tree levels, degrees of separation.
2. **"What's the fewest steps?"** The shortest path in an **unweighted** graph or grid. The first time BFS reaches a node is guaranteed to be the shortest route there.

**Multi-source BFS:** put *several* starting points in the queue at once. They spread out together, like ripples from several stones. That's how you model "fire spreads from every burning tree at once".

## When to recognize it

- "**Minimum** number of steps / moves / minutes / hops."
- "Level by level", "layer", "distance k".
- Grids where something **spreads** each tick: fire, infection, water, rot.
- Word or state transformations where each change costs 1, as in Word Ladder.

If edges have **different weights**, plain BFS isn't enough. Use Dijkstra, which is BFS with a priority queue (see `07_heap`).

## Template: BFS level by level

```js
const queue = [start];
const seen = new Set([key(start)]); // mark when you ENQUEUE, not when you dequeue
let head = 0;                        // index pointer: avoids O(n) queue.shift()
let steps = 0;

while (head < queue.length) {
  const levelEnd = queue.length;     // everything up to here is the current level
  while (head < levelEnd) {
    const node = queue[head++];
    for (const next of neighbours(node)) {
      if (!seen.has(key(next))) {
        seen.add(key(next));
        queue.push(next);
      }
    }
  }
  steps++;
}
```

## Grid neighbours helper

```js
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
for (const [dr, dc] of DIRS) {
  const r = row + dr, c = col + dc;
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) continue;
  // ...
}
```

## Complexity

- O(V + E) for a graph. For a grid: O(rows × cols), since each cell is enqueued once.
- Space: O(V) for the queue and the `seen` set.

## Common bugs

- **Marking "seen" when dequeuing instead of when enqueuing.** The same node gets queued many times. It's still correct, but it can blow up the run time.
- **`queue.shift()` is O(n)** on a JS array, which makes the whole BFS O(n²) on big inputs. Use a `head` index (as above), or swap two arrays per level.
- Losing level boundaries. Snapshot `queue.length` at the start of each level.
- Off-by-one in the "minutes" or "steps" count: does the last level count, or not?
- Grid keys: `"r,c"` strings work in a `Set`. Arrays don't, because `[1,2] !== [1,2]`. You can also use `r * cols + c`.

## Problems

| #   | Problem                                            | LeetCode                                                                                                  | Level  |
| --- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------ |
| 1   | [Org Chart Levels](1_org_chart_levels/problem.md)  | [#429 N-ary Tree Level Order Traversal](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) (the classic is [#102](https://leetcode.com/problems/binary-tree-level-order-traversal/)) | Medium |
| 2   | [Wildfire Spread](2_wildfire_spread/problem.md)    | [#994 Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)                                    | Medium |

**More:** [#1091 Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/), [#199 Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/), [#127 Word Ladder](https://leetcode.com/problems/word-ladder/) (Hard).
