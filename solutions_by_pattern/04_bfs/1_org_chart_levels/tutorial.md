# Tutorial: Org Chart Levels

**Problem:** [problem.md](../../../problems_by_pattern/04_bfs/1_org_chart_levels/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#429 N-ary Tree Level Order Traversal](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) / [#102](https://leetcode.com/problems/binary-tree-level-order-traversal/)

Group the people in a tree by depth, left to right.

---

## Step 1: Why BFS fits

"Level by level" means BFS. A **queue** (first in, first out) visits nodes in order of distance from the root: all of depth 0, then all of depth 1, and so on. Left-to-right order comes for free, because each person's reports are enqueued in array order, and managers are dequeued in left-to-right order.

## Step 2: Keeping track of level boundaries

A plain BFS visits everyone in the right *order*, but it gives one flat list. To group by level, use this trick:

> At the moment you **start** a level, the queue contains **exactly** that level, and nothing else.

So snapshot the queue's length (`levelEnd`), process exactly that many people, and everything pushed meanwhile belongs to the next level.

## Step 3: Trace the example

```
          Ana
        /     \
      Ben      Cara
     /   \        \
   Dev   Eli      Fay
    |
   Gus
```

| level | queue at the start (from `head`) | dequeue in order | push (the next level) | output      |
| ----- | -------------------------------- | ---------------- | --------------------- | ----------- |
| 0     | Ana                              | Ana              | Ben, Cara             | `["Ana"]`   |
| 1     | Ben, Cara                        | Ben, Cara        | Dev, Eli, Fay         | `["Ben", "Cara"]` |
| 2     | Dev, Eli, Fay                    | Dev, Eli, Fay    | Gus                   | `["Dev", "Eli", "Fay"]` |
| 3     | Gus                              | Gus              | none                  | `["Gus"]`   |

## Step 4: Two JavaScript details

**1. Don't use `queue.shift()`.** It re-indexes the whole array, which is O(n) per call, so BFS becomes O(n²) on big inputs. Use a `head` index that only moves forward. The array grows, but nothing is ever moved.

**2. A compact version.** Build the next level directly from the current one:

```js
let current = [root];
while (current.length) {
  levels.push(current.map((p) => p.name));
  current = current.flatMap((p) => p.reports);
}
```

Same complexity, very readable, and it shows the "levels" idea clearly. Both versions are in [solution.js](solution.js).

## Step 5: Why not recursion (the 20,000-deep test)

A natural alternative is DFS with a `depth` parameter: `visit(node, depth)` pushes `node.name` into `levels[depth]`. It produces the same answer, **but** each level of the tree is a nested function call. Node allows only around **5,000 to 10,000** nested calls, so the 20,000-deep chain throws `Maximum call stack size exceeded`. BFS uses a loop and an array, so depth doesn't matter.

## Complexity

- **Time O(n):** each person is enqueued and dequeued once.
- **Space O(n):** the queue, plus the output. The widest level dominates the queue.

## Pitfalls

- Mixing levels: you have to snapshot `queue.length` **before** the inner loop.
- `null` root: return `[]`, not `[[]]`.
- `shift()` performance (above).

## Follow-up answers

1. **The deep chain:** see Step 5.
2. **Zigzag (#103):** same BFS. Reverse `names` on every odd level (or build it with `unshift` on odd levels).
3. **Widest level / right side view (#199):** same BFS. Track `max(names.length)`, or take `names[names.length - 1]`.

## Say it in the interview

> "Level order is BFS. I use a queue, and at the start of each level the queue holds exactly that level, so I snapshot its length, pop that many people, collect their names, and push their reports for the next round. I use a head index instead of shift() to keep it O(n). It's iterative, so a very deep org chart is fine. A recursive DFS would hit the call stack limit."
