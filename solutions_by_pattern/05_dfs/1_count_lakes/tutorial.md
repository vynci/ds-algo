# Tutorial: Count the Lakes

**Problem:** [problem.md](../../../problems_by_pattern/05_dfs/1_count_lakes/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#200 Number of Islands](https://leetcode.com/problems/number-of-islands/) + [#695 Max Area of Island](https://leetcode.com/problems/max-area-of-island/)

Count the connected groups of water cells, and find the size of the biggest one.

---

## Step 1: See the grid as a graph

Each water cell is a **node**. Two water cells that are up, down, left or right of each other share an **edge**. A "lake" is then a **connected component**. "Count lakes" means counting components.

## Step 2: The flood-fill pattern

```
for every cell:
  if it's water and NOT visited yet:
    it's the start of a NEW lake, so count++
    flood-fill from it: visit and mark every connected water cell
```

The flood-fill guarantees that each lake is "used up" the first time you touch it, so later cells of the same lake are skipped by the `visited` check. Each lake is counted exactly once.

To get the **largest** lake too, have the flood-fill return how many cells it visited.

## Step 3: Trace the example

```
(0,0) ~  (0,1) ~  (0,2) #
(1,0) ~  (1,1) #  (1,2) #
(2,0) #  (2,1) ~  (2,2) ~
```

| scan cell | what happens                                                     | count | largest |
| --------- | ---------------------------------------------------------------- | ----- | ------- |
| (0,0) ~   | new lake. Fill: (0,0), then (1,0) and (0,1) are pushed and visited. Size 3 | 1     | 3       |
| (0,1) ~   | already visited, skip                                            | 1     | 3       |
| (1,0) ~   | already visited, skip                                            | 1     | 3       |
| (2,1) ~   | new lake. Fill: (2,1), (2,2). Size 2                             | 2     | 3       |
| (2,2) ~   | already visited, skip                                            | 2     | 3       |

The answer is `{ count: 2, largest: 3 }` ✓

## Step 4: Recursive vs iterative (the giant-lake trap)

Most people write flood-fill recursively first, and that's the right instinct for an interview:

```js
function fill(r, c) {
  if (outOfBounds || notWater || visited) return 0;
  visited = true;                 // mark BEFORE recursing
  return 1 + fill(down) + fill(up) + fill(right) + fill(left);
}
```

But each cell it reaches is **one more nested call**. A 300×300 lake can snake 90,000 calls deep, and Node's stack holds only about 9,000 for this function, so you get `Maximum call stack size exceeded`.

**The fix is mechanical:** replace the call stack with your own array.

```js
const stack = [start];
while (stack.length) {
  const cell = stack.pop();       // pop() takes the newest, which makes it depth-first
  for (const next of neighbours(cell))
    if (isWater(next) && !visited(next)) { markVisited(next); stack.push(next); }
}
```

The visit order is a bit different, but the **set** of visited cells is the same, and that's all we need. (Swap `pop()` for a queue and it's BFS. For flood fill, either works.)

## Step 5: Small implementation choices

- **`visited` as a `Uint8Array(rows * cols)`:** a flat grid of 0/1 values, indexed by `r * cols + c`. It's faster and lighter than a `Set` of `"r,c"` strings. A `Set` is fine too, and easier to type in an interview.
- **The input is an array of strings**, so you can't overwrite `~` with `#` to mark cells visited, which is the trick most LeetCode answers use. A separate `visited` grid also avoids mutating the input, which is good practice.

## Complexity

- **Time O(rows × cols):** each cell is scanned once and pushed at most once.
- **Space O(rows × cols):** `visited`, plus the stack in the worst case, when the whole map is one lake.

## Pitfalls

- Marking visited **after** processing instead of **when pushing**. Cells get pushed many times.
- Diagonals: the `"diagonals don't connect"` test catches them.
- Recursion depth on big inputs (Step 4).

## Follow-up answers

1. **Recursive vs iterative:** recursive is shorter and easier to say out loud. Iterative is safe for big grids. A good answer is "I'll write it recursively, and in production I'd switch to an explicit stack because of the depth limit".
2. **BFS instead:** yes, with the same answers. Only the visit order changes.
3. **Closed lakes (#1254):** first flood-fill from every water cell on the border, which marks the lakes that touch the edge. Then count the rest.
4. **Streaming or very large maps:** use Union-Find (disjoint sets). Union each new water cell with its water neighbours, and count the roots. It handles cells arriving one by one ([#305](https://leetcode.com/problems/number-of-islands-ii/)).

## Say it in the interview

> "Water cells form a graph and lakes are connected components. I scan the grid, and whenever I find unvisited water I count a new lake and flood-fill it with DFS, marking cells visited and counting its size for the largest. I'd use an explicit stack rather than recursion so a huge lake doesn't overflow the call stack. It's O(rows × cols) time and space."
