# The Alternative Solution, Line by Line: Binary Search + BFS

This walks through `leastSteepRouteBinarySearch` in [`solution.js`](solution.js) (lines 100–132), one section at a time. The main Dijkstra solution is covered in [`tutorial.md`](tutorial.md). This file is only about the alternative.

---

## 0. The idea in one paragraph

Dijkstra asks: *"What is the least steep route?"* That's a hard **optimization** question.

This solution asks an easier **yes/no** question instead:

> *"If I refuse to ride any step steeper than `limit`, can I still get from the top-left to the bottom-right?"*

Ask that question for different values of `limit`, and the answer is the **smallest `limit` that says yes**. Binary search finds that smallest value quickly.

So the solution has two parts:

| Part | Lines | Job |
| --- | --- | --- |
| `canReach(limit)` | 104–122 | Answers the yes/no question with a BFS |
| The binary search | 124–131 | Finds the smallest `limit` where `canReach` says yes |

This is the same "binary search on the answer" trick as [Minimum Reading Speed](../../03_binary_search/2_min_reading_speed/tutorial.md): *"Is speed X enough?"* there, *"Is limit X enough?"* here.

---

## 1. Why binary search is allowed here (monotonicity)

Binary search only works if the yes/no answers are **sorted**: all the "no"s come first, then all the "yes"s.

That holds here:

- If you can finish the ride with `limit = 3`, then you can also finish with `limit = 4`. Every step that was allowed at 3 is still allowed at 4, so the same route still works.
- If you **can't** finish with `limit = 3`, then you can't with `limit = 2` either, because you have even fewer allowed steps.

So for the example grid the answers look like this:

```
limit:     0    1    2    3    4    5    6    7
canReach:  no   no   YES  YES  YES  YES  YES  YES
                     ^
                     the first YES is the answer (2)
```

The problem has become *"find the first YES"*. That is a textbook binary search.

---

## 2. Setup: lines 100–102

```js
function leastSteepRouteBinarySearch(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
```

These read the grid size once so the rest of the code can use `rows` and `cols`. They are the same as in the Dijkstra version.

---

## 3. `canReach(limit)`: lines 104–122

`canReach` is an arrow function defined **inside** the main function. That way it can use `heights`, `rows` and `cols` without passing them in each time. This is a closure.

### Line 104: the signature

```js
  const canReach = (limit) => {
```

Input: the steepest step you're willing to ride. Output: `true` if the bottom-right corner can be reached, otherwise `false`.

### Line 105: the `seen` array

```js
    const seen = new Uint8Array(rows * cols);
```

This tracks which cells the BFS has already reached. Three details:

1. **It's flat, not 2-D.** Cell `(r, c)` lives at index `r * cols + c`. In a 3-column grid:

   ```
   (0,0)->0  (0,1)->1  (0,2)->2
   (1,0)->3  (1,1)->4  (1,2)->5
   (2,0)->6  (2,1)->7  (2,2)->8
   ```

   You move down a row by adding `cols` to the index, and move right by adding 1.

2. **`Uint8Array` starts as all zeros**, which here means "not seen". It stores one byte per cell, so it's compact and fast. Using a typed array also avoids the shared-row `fill([])` trap from the tutorial.

3. **It's created fresh on every call.** Each `canReach(limit)` is a separate experiment, so cells seen during `canReach(3)` must not count as seen during `canReach(1)`.

> A plain `Array.from({ length: rows }, () => new Array(cols).fill(false))` works just as well. The flat typed array is just a common habit for grids.

### Lines 106–107: start the BFS

```js
    const queue = [[0, 0]];
    seen[0] = 1;
```

The queue starts with the top-left cell. Its flat index is `0 * cols + 0 = 0`, so `seen[0] = 1` marks it as seen. Without that line, a neighbour could step back into the start and add it to the queue a second time.

### Line 108: the BFS loop with a head pointer

```js
    for (let head = 0; head < queue.length; head++) {
```

This is the "head pointer" BFS from the [BFS tutorials](../../04_bfs/1_org_chart_levels/tutorial.md). Instead of `queue.shift()`, which is **O(n)** because it moves every element along, we leave the array alone and move a `head` index forward:

```
queue: [ A, B, C, D, E ]
              ^head      everything before head has been processed
```

`head < queue.length` checks the length again on every turn, so the loop keeps going as new cells are pushed. It stops when `head` catches up with the end, meaning the queue is empty.

### Lines 109–110: take a cell and check for the goal

```js
      const [r, c] = queue[head];
      if (r === rows - 1 && c === cols - 1) return true;
```

If the cell we just took out is the bottom-right corner, then the corner is reachable with this `limit`, so return `true` right away. There's no need to explore the rest of the grid.

> **Edge case:** for a `1 x 1` grid the start *is* the goal, so this returns `true` on the first turn. In practice the binary search loop never even calls `canReach` for that grid (see section 4).

### Lines 111–114: look at the 4 neighbours and stay in bounds

```js
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
```

`DIRECTIONS` is the shared `[[1,0],[-1,0],[0,1],[0,-1]]` table: down, up, right, left. `(nr, nc)` is the neighbour, and the `if` skips anything off the edge of the grid.

### Lines 115–116: the two filters

```js
        if (seen[nr * cols + nc]) continue;
        if (Math.abs(heights[nr][nc] - heights[r][c]) > limit) continue; // too steep for this limit
```

- **Line 115:** already reached, so skip it. This is ordinary BFS.
- **Line 116:** this is where `limit` is used. If the step from `(r, c)` to the neighbour is steeper than `limit`, act as if that edge **doesn't exist**. `Math.abs` is there because downhill counts too.

Line 116 is the only line of `canReach` that knows anything about steepness. Without it, this is a plain BFS over a grid. In effect, `limit` **deletes every edge that's too steep**, and the BFS checks whether the two corners are still connected.

The order of the checks is deliberate, cheapest first: the bounds check (114) must come **before** anything that reads `heights[nr]`, otherwise `heights[-1]` is `undefined` and `undefined[nc]` throws.

### Lines 117–118: mark the neighbour and add it to the queue

```js
        seen[nr * cols + nc] = 1;
        queue.push([nr, nc]);
```

The cell is marked as seen **when it's pushed**, not when it's popped. If you mark on pop instead, two different cells can both push the same neighbour before either of them is popped. You'd get duplicates in the queue: still correct, but slower.

### Lines 121–122: unreachable

```js
    return false;
  };
```

The queue ran out without ever taking out the goal. That means every cell reachable from the start using steps `<= limit` has been visited, and the goal wasn't one of them. So this `limit` is too strict.

### Why BFS, and not Dijkstra, inside `canReach`?

The question is now just **"is the goal reachable at all?"**, and that doesn't involve distances. Any way of walking the graph answers it: BFS, an iterative DFS with a stack, or union-find. No heap is needed. That's the whole appeal of this approach: it swaps a weighted shortest-path problem for many unweighted reachability checks.

---

## 4. The binary search: lines 124–131

### Line 124: the lower bound

```js
  let lo = 0;
```

The smallest possible answer is 0, a perfectly flat route.

### Line 125: the upper bound

```js
  let hi = Math.max(...heights.flat()) - Math.min(...heights.flat()); // no step is steeper than this
```

No single step can be steeper than **highest block minus lowest block**. So with `limit = hi`, every edge is allowed, the whole grid is connected, and `canReach(hi)` is guaranteed to be `true`. That guarantees the answer lies in `[lo, hi]`.

What the line does, from the inside out:

- `heights.flat()` turns `[[1,2,2],[3,8,2],[5,3,5]]` into `[1,2,2,3,8,2,5,3,5]`.
- `...` spreads that into separate arguments: `Math.max(1, 2, 2, 3, 8, ...)`.
- So `hi = 8 - 1 = 7` for the example.

> **Caveat about large grids:** spreading puts every element on the call stack as an argument. On Node v24, `Math.max(...arr)` works at 100,000 elements and throws `RangeError: Maximum call stack size exceeded` at 200,000. LeetCode's 100 x 100 grid (10,000 cells) and this file's 200 x 200 test (40,000 cells) are fine. For a 1000 x 1000 grid you'd use a plain loop instead:
>
> ```js
> let max = -Infinity, min = Infinity;
> for (const row of heights) for (const h of row) { if (h > max) max = h; if (h < min) min = h; }
> let hi = max - min;
> ```
>
> Or skip the calculation and use the problem's limit (`hi = 10 ** 6` on LeetCode). That costs only a few extra binary search rounds.

### Lines 126–130: the search

```js
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canReach(mid)) hi = mid;
    else lo = mid + 1;
  }
```

This is the **"find the first YES"** template from [`03_binary_search`](../../../problems_by_pattern/03_binary_search/README.md). The invariant is:

> **The answer is always somewhere in `[lo, hi]`.**

Each branch keeps that invariant true:

| Result | What it tells us | Update | Why |
| --- | --- | --- | --- |
| `canReach(mid)` is **true** | `mid` works, so the answer is `mid` or smaller | `hi = mid` | Not `mid - 1`: `mid` itself might be the answer, so keep it |
| `canReach(mid)` is **false** | `mid` is too strict, and so is everything below it (monotonicity) | `lo = mid + 1` | `mid` is definitely not the answer, so drop it |

**Why `lo < hi`, not `lo <= hi`?** When `lo === hi`, the range holds exactly one value, and the invariant says it's the answer. There's nothing left to test.

**Why `Math.floor`?** When `lo < hi`, flooring guarantees `mid < hi`. So `hi = mid` always shrinks the range, and so does `lo = mid + 1`. If you rounded **up** instead, then with `lo = 0, hi = 1` you'd get `mid = 1`. If `canReach(1)` is true, then `hi = 1` again, nothing changes, and the loop never ends.

### Line 131: the answer

```js
  return lo;
```

The loop ends with `lo === hi`, the smallest `limit` that says yes. Why is that **exactly** the least steepness of any route, and not just an upper bound on it?

- `canReach(lo)` is true, so some route has no step steeper than `lo`. The best route's steepness is therefore `<= lo`.
- `canReach(lo - 1)` is false (otherwise `lo` wouldn't be the *first* YES), so no route has every step `<= lo - 1`. The best route's steepness is therefore `>= lo`.

Together that gives exactly `lo`.

For a `1 x 1` grid, `hi = h - h = 0`, so the `while` never runs and the function returns `0` without calling `canReach` at all.

---

## 5. Full trace on the example

```
heights = [[1, 2, 2],
           [3, 8, 2],
           [5, 3, 5]]

lo = 0, hi = 8 - 1 = 7
```

| Round | lo | hi | mid | `canReach(mid)` | Why | Update |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 7 | 3 | **true** | e.g. `1 → 2 → 2 → 2 → 5` along the top and right edge. Steps 1, 0, 0, 3 are all `<= 3` | `hi = 3` |
| 2 | 0 | 3 | 1 | **false** | BFS reaches only `(0,0)=1, (0,1)=2, (0,2)=2, (1,2)=2`, then gets stuck: `1→3` is 2, `2→8` is 6, `2→5` is 3. All are too steep | `lo = 2` |
| 3 | 2 | 3 | 2 | **true** | Down the left side and along the bottom: `1 → 3 → 5 → 3 → 5`. Every step is 2 | `hi = 2` |
| end | 2 | 2 | | | `lo === hi` | return **2** |

Three BFS runs, and the answer is 2, matching the Dijkstra version. I checked this trace by running the code.

---

## 6. Complexity

Let `R x C` be the grid size and `H = max - min` be the height range.

| | Time | Space |
| --- | --- | --- |
| One `canReach` | O(R·C): each cell is pushed at most once, with 4 neighbour checks | O(R·C) for `seen` + `queue` |
| Binary search | about log₂(H) + 1 calls to `canReach` | (reuses the above) |
| **Total** | **O(R·C · log H)** | **O(R·C)** |

Compare that with Dijkstra's **O(R·C · log(R·C))**. The two are in the same ballpark. Which one is faster depends on whether the height range `H` or the cell count `R·C` is bigger. On LeetCode (H up to 10⁶, R·C up to 10⁴), log H ≈ 20 and log(R·C) ≈ 13, so they're close.

---

## 7. Dijkstra or binary search: which to use in an interview?

| | Dijkstra (main solution) | Binary search + BFS (this file) |
| --- | --- | --- |
| Needs a heap? | Yes, you have to write one in JS | **No**, just an array |
| Pieces | One algorithm with a twist (`max` instead of `+`) | Two simple, well-known pieces glued together |
| Easy to get right under pressure? | Medium: stale entries, return on pop | **High**: BFS and the binary search template are both standard |
| Gives the actual route? | Yes, with a `previous` table | Not directly |
| Shows the interviewer... | Graph-algorithm depth | Problem reduction ("I turned optimization into a yes/no question") |

A good move in an interview is to **mention both**. For example: *"This is a minimax path, so Dijkstra with `max` works. Alternatively, since 'can I make it with limit X' is monotonic, I could binary search on X with a BFS check, which avoids writing a heap."* Then write whichever one you're more confident in.

---

## 8. Common mistakes in this version

| Mistake | What happens | Fix |
| --- | --- | --- |
| Reusing `seen` across `canReach` calls | Later checks think cells are already visited, so they return false when the answer is yes | Create `seen` inside `canReach` (line 105) |
| Forgetting `seen[0] = 1` | The start can be added to the queue again: extra work | Mark the start right away (line 107) |
| Marking `seen` on pop instead of push | Duplicate queue entries, slower | Mark when pushing (line 117) |
| Checking `heights[nr][nc]` before the bounds check | `heights[-1][c]` throws a `TypeError` | Bounds first (line 114) |
| `hi = mid - 1` on success | Can skip right past the answer | `hi = mid` (line 128) |
| `while (lo <= hi)` with `hi = mid` | Infinite loop when `lo === hi` and `canReach` is true | `while (lo < hi)` (line 126) |
| `Math.ceil` for `mid` | Infinite loop (see section 4) | `Math.floor` (line 127) |
| `Math.max(...hugeArray)` | `RangeError` above roughly 100k–200k elements | Loop for min and max, or use the problem's limit as `hi` |
| Forgetting `Math.abs` | Downhill steps look negative, so they always pass the limit | `Math.abs(...)` (line 116) |
