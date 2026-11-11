# Tutorial: Build Order

**Problem:** [problem.md](../../../problems_by_pattern/05_dfs/2_build_order/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#210 Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

Order the packages so that every dependency is built first, or detect a circular dependency.

---

## Step 1: Name the problem

This is **topological sort**: ordering the nodes of a **directed** graph so every edge points "forward". It's possible exactly when the graph has **no cycle**. (Such a graph is a DAG, a directed acyclic graph.)

There are two standard algorithms, and you should know both:

| | DFS (post-order) | Kahn's algorithm (BFS) |
| --- | --- | --- |
| Idea | Build a package after recursively building all its dependencies | Repeatedly build whatever has no unbuilt dependencies left |
| Cycle detection | 3-state marking | Some packages never become "ready" |
| Iterative? | Recursive (depth-limited) | ✅ Yes |
| Bonus | Natural for "find the cycle" | Natural for "build in parallel waves" |

## Step 2: The DFS approach, and why it needs 3 states

To "build" a package: first build each of its dependencies (recursively), **then** add the package itself to the output. This is **post-order**: by the time a package is pushed, everything it needs is already in the list.

### The diamond trap

A natural first attempt uses a single `visited` set and says "if I've seen it before, it's a cycle". That's **wrong**:

```
      top
     /   \
  left   right       top depends on left and right; both depend on base
     \   /
      base
```

DFS visits `top`, then `left`, then `base` (DONE). Back up, then `right` reaches `base` **again**. It *was* visited, but it's **finished**, not part of a loop.

A cycle means reaching a node that's **still on the current path**. So track three states:

| State     | Meaning                              | Reaching it again means                   |
| --------- | ------------------------------------ | ------------------------------------------ |
| UNVISITED | not started                          | go explore it                             |
| VISITING  | on the current recursion path        | **cycle!** We walked back into our own path |
| DONE      | it and all its dependencies are built | fine, just skip it                        |

That's `buildOrderRecursive` in [solution.js](solution.js).

## Step 3: Kahn's algorithm (the solution that passes every test)

Think about how you'd actually build things by hand:

1. Count, for each package, how many dependencies it's **waiting on** (its in-degree).
2. Everything waiting on **0** is ready, so put it in a queue.
3. Build one ready package. For each package that was waiting on it, decrement its count. If that hits 0, it's now ready.
4. Repeat until the queue is empty.

**Cycle detection is free:** packages in a cycle wait on each other forever, so their count never reaches 0 and they're never built. If `order.length < packages.length`, there's a cycle, and you return `null`.

### Trace the example

`deps`: app needs ui and api, api needs db and utils, ui needs utils.

| step | queue (ready) | build | unlocks (count after)          | order so far             |
| ---- | ------------- | ----- | ------------------------------ | ------------------------ |
| init | db, utils     | none  | counts: app 2, ui 1, api 2     |                          |
| 1    | db, utils     | db    | api: 2 → 1                     | db                       |
| 2    | utils         | utils | ui: 1 → **0**, api: 1 → **0** | db, utils                |
| 3    | ui, api       | ui    | app: 2 → 1                     | db, utils, ui            |
| 4    | api           | api   | app: 1 → **0**                 | db, utils, ui, api       |
| 5    | app           | app   | none                           | db, utils, ui, api, app ✓ |

All 5 were built, so there's no cycle.

## Step 4: Why the deep test needs Kahn's algorithm

The last test is a 20,000-package chain, listed top-down. Recursive DFS goes 20,000 calls deep, and Node allows about 5,000 to 10,000, so it overflows. Kahn's algorithm is a loop over an array, so depth doesn't matter. (You could also convert the DFS to an explicit stack, but 3-state post-order DFS is fiddly to write iteratively. Kahn's algorithm is simpler.)

## Complexity

Both versions: **O(P + D)** time and space, where P = packages and D = dependency pairs. Each package and each edge is processed once.

## Pitfalls

- Two-state DFS reporting diamonds as cycles (Step 2).
- Only starting the DFS from the first package. The graph may be **disconnected**, and a cycle can hide in another component (the `cycle hidden in a disconnected part` test).
- Getting the edge direction backwards. `[pkg, dependsOn]` means `dependsOn` comes **first**. Write it down before you code.
- Using `shift()` on the Kahn queue. Use a head index.

## Follow-up answers

1. **The diamond:** see Step 2.
2. **Return the cycle:** in the DFS, keep the current path in an array. When you hit a VISITING node, the cycle is the slice of the path from that node to the end, plus the node again.
3. **Parallel waves:** run Kahn's algorithm level by level, like BFS levels. Everything in the queue at the same time can be built in parallel. The number of levels is the minimum number of sequential build rounds.
4. **An unknown dependency:** ask! The options are to throw an error, treat it as an external package that's already built, or ignore it. In real build tools it's usually an error.

## Say it in the interview

> "This is topological sort. I'd use Kahn's algorithm: count how many dependencies each package is waiting on, start with the zero-dependency ones, and as each is built, decrement its dependents and queue any that reach zero. If some packages never reach zero, they're in a cycle, so I return null. That's O(P + D). The DFS alternative needs three states, because revisiting a finished node in a diamond isn't a cycle, only revisiting one on the current path is."
