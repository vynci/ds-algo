# Least Steep Bike Route

> **Pattern:** Dijkstra with a different cost rule (minimax). **LeetCode:** [#1631 Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) (Medium)

A city cycling app wants routes that avoid steep climbs. The city is a grid where `heights[r][c]` is the elevation of each block. A rider starts at the **top-left** block and wants to reach the **bottom-right** block, moving **up, down, left or right** one block at a time.

A route's **steepness** is the **largest** elevation change (up *or* down) between any two consecutive blocks along it. It is *not* the total. One nasty hill is what riders remember.

Write `leastSteepRoute(heights)`. It returns the **minimum steepness** of any route from the top-left to the bottom-right.

- The grid has at least one block. A 1×1 grid has steepness `0`.
- Heights are non-negative integers.

## Example

```
heights:
  1  2  2
  3  8  2
  5  3  5

Route 1 -> 3 -> 5 -> 3 -> 5: changes are 2, 2, 2, 2, so the steepness is 2.  ✓ best
Route 1 -> 2 -> 2 -> 2 -> 5: changes are 1, 0, 0, 3, so the steepness is 3.
```

```js
leastSteepRoute([[1, 2, 2], [3, 8, 2], [5, 3, 5]]); // 2
```

## Target

O(R·C · log(R·C)) with Dijkstra.

<details>
<summary>Hint</summary>

It's Dijkstra on the grid, where each block is a node and its up-to-4 neighbours are the edges. The only change is **how a path's cost grows**. Normal Dijkstra adds: `cost + weight`. Here a path's cost is the **max** step so far: `Math.max(cost, |heightA - heightB|)`. Everything else stays the same, and the "smallest popped is final" argument still holds. Why?

</details>

## Follow-ups

1. Why is it valid to use Dijkstra with `max` instead of `+`? What property of `max` makes "smallest popped is final" still true?
2. **Alternative approach:** binary search on the answer (see `03_binary_search`). "Can I get there with steepness ≤ X?" is a yes/no question that BFS/DFS answers, and it's monotonic in X. What's the complexity?
3. A third approach: sort all edges by steepness and add them with **Union-Find** until start and end are connected.
4. Riders also want the **shortest** of the least-steep routes. How would you break ties?
