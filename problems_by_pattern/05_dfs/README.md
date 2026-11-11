# DFS (Depth-First Search)

## The idea

Explore a graph by going **as deep as possible** down one path before backing up and trying the next. Recursion gives you this for free, because the call stack *is* the "where to back up to" list. You can also use an explicit **stack** (last in, first out).

Where BFS is about *distance*, DFS is about **reachability and structure**:

1. **"Which things are connected?"** Flood fill, counting islands or regions, connected components.
2. **"Is there a cycle?"** "In what order can these be done?" Dependency graphs and topological sort.
3. **Tree problems**: depth, path sums, validate a BST. Most of these are DFS in disguise.

## When to recognize it

- "Count the regions / islands / groups / components."
- "Can you reach X from Y?" (BFS works too.)
- Dependencies, prerequisites, build or install order, "detect a cycle".
- Anything where you need to fully finish a branch before deciding something about its parent.

## Template: recursive DFS on a grid (flood fill)

```js
function fill(r, c) {
  if (r < 0 || c < 0 || r >= rows || c >= cols) return 0; // off the map
  if (seen[r][c] || grid[r][c] !== TARGET) return 0;       // wall or already done
  seen[r][c] = true;                                       // mark BEFORE recursing
  return 1 + fill(r + 1, c) + fill(r - 1, c) + fill(r, c + 1) + fill(r, c - 1);
}
```

## Template: iterative DFS (no stack overflow)

```js
const stack = [start];
seen.add(key(start));
while (stack.length) {
  const node = stack.pop();           // pop() = LIFO = depth-first
  for (const next of neighbours(node)) {
    if (!seen.has(key(next))) {
      seen.add(key(next));
      stack.push(next);
    }
  }
}
```

## Cycle detection: three states, not two

In a **directed** graph, "already visited" is not the same thing as "cycle". Track three states:

| State                | Meaning                                         |
| -------------------- | ----------------------------------------------- |
| `UNVISITED`          | Not touched yet                                 |
| `VISITING` (on path) | Currently on the recursion stack                |
| `DONE`               | Fully explored, and no cycle through it         |

You've found a cycle only when you reach a node that is **`VISITING`**. Reaching a `DONE` node is fine: it's a diamond, not a loop.

**Topological order** falls out for free. When a node becomes `DONE`, everything it depends on is already `DONE`, so push it to the output at that moment.

## Complexity

- O(V + E) for a graph, or O(rows × cols) for a grid.
- Space: O(V) for `seen`, plus the **recursion depth**, which can be O(V) in the worst case.

## Common bugs

- **Stack overflow.** Node allows roughly 10,000 nested calls. A 300×300 region recursed one cell at a time is 90,000 deep. Use the iterative version for big grids, and mention this in interviews.
- Marking a cell seen *after* the recursive calls, which leads to infinite recursion.
- Two-state cycle detection in directed graphs: it falsely flags diamonds as cycles.
- Forgetting **disconnected** parts. Start a DFS from *every* unvisited node, not just node 0.

## Problems

| #   | Problem                                      | LeetCode                                                                                                                                         | Level  |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 1   | [Count the Lakes](1_count_lakes/problem.md)  | [#200 Number of Islands](https://leetcode.com/problems/number-of-islands/) + [#695 Max Area of Island](https://leetcode.com/problems/max-area-of-island/) | Medium |
| 2   | [Build Order](2_build_order/problem.md)      | [#210 Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) (see also [#207](https://leetcode.com/problems/course-schedule/))   | Medium |

**More:** [#104 Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) (warm-up), [#133 Clone Graph](https://leetcode.com/problems/clone-graph/), [#417 Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/).
