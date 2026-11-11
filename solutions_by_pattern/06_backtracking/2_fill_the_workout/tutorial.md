# Tutorial: Fill the Workout

**Problem:** [problem.md](../../../problems_by_pattern/06_backtracking/2_fill_the_workout/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#39 Combination Sum](https://leetcode.com/problems/combination-sum/)

Find every combination of block lengths (reuse allowed) that adds up to exactly `minutes`.

---

## Step 1: Start from the subsets template

If you've done [Feature Flag Combos](../1_feature_flag_combos/tutorial.md), this is the same skeleton with **three small changes**:

| Change | Why |
| --- | --- |
| Pass `remaining` down, and record only when `remaining === 0` | We want exact sums, not every subset |
| Recurse with **`i`** instead of `i + 1` | A block can be used again |
| **Sort**, then `break` when `block > remaining` | Pruning: skip branches that can't work |

## Step 2: Why `backtrack(i)` gives reuse without duplicates

- `backtrack(i + 1)`: after choosing block `i`, you can only pick **later** blocks, so each is used once.
- `backtrack(i)`: you can pick block `i` **again**, or later ones, but never **earlier** ones.
- `backtrack(0)`: you could pick anything, so `[2, 3]` *and* `[3, 2]` both appear. ❌

Choosing in **non-decreasing order** makes every plan come out in exactly one order (sorted). Each plan is generated once.

## Step 3: Pruning

Without pruning, the search tries adding a 7 when only 1 minute is left, and so on. With a **sorted** list, once `block > remaining`, every block after it is even bigger, so `break` (not just `continue`). This often cuts the search tree dramatically.

## Step 4: Trace `[2, 3, 6, 7]`, target 7

```
bt(start 0, rem 7)  path []
├─ 2 -> bt(0, 5)  [2]
│   ├─ 2 -> bt(0, 3)  [2, 2]
│   │   ├─ 2 -> bt(0, 1)  [2, 2, 2]
│   │   │   └─ 2 > 1, break                     (pruned)
│   │   ├─ 3 -> bt(1, 0)  [2, 2, 3]  ✅ record
│   │   └─ 6 > 3, break
│   ├─ 3 -> bt(1, 2)  [2, 3]
│   │   └─ 3 > 2, break
│   └─ 6 > 5, break
├─ 3 -> bt(1, 4)  [3]
│   ├─ 3 -> bt(1, 1)  [3, 3]
│   │   └─ 3 > 1, break
│   └─ 6 > 4, break
├─ 6 -> bt(2, 1)  [6]
│   └─ 6 > 1, break
└─ 7 -> bt(3, 0)  [7]  ✅ record
```

The result is `[[2, 2, 3], [7]]` ✓. Notice that `[3, 2, 2]` is never generated: from `[3]` we never look back at `2`.

## Complexity

It's exponential in the worst case. A rough bound is O(N^(T/m)), where N = the number of blocks, T = the target and m = the smallest block (that's the depth of the tree). Plus O(T/m) for the recursion depth and path. In interviews, say "exponential, and pruning helps a lot in practice".

## Pitfalls

- Recursing with `0`, which produces duplicate plans. The `no duplicate plans` test catches it.
- Recursing with `i + 1`, which allows no reuse, so `[2, 2, 3]` is missed.
- `continue` instead of `break` after sorting is still correct, just slower. Without sorting, `break` is **wrong**.
- Sorting the caller's array in place. The `does not mutate blocks` test catches it.
- `plans.push(path)` without copying.

## Follow-up answers

1. **Why `i` avoids duplicates:** plans are always built in non-decreasing order, so each multiset has exactly one way to be built.
2. **Each block at most once, with duplicate values (#40):** sort, recurse with `i + 1`, and skip `if (i > start && sorted[i] === sorted[i - 1]) continue`.
3. **Just the count, for large `minutes`:** dynamic programming (#518 Coin Change II). `ways[0] = 1`, and for each block `b`, for `t` from `b` to `minutes`: `ways[t] += ways[t - b]`. That's O(N · T), and no list of plans is needed. This DP is how the "full hour" test's expected answer of 44 was double-checked.
4. **The plan with the fewest blocks (#322):** BFS over "minutes remaining" (each block is one step), or DP with `min`.

## Say it in the interview

> "This is backtracking. I sort the blocks, then recursively choose a block, subtract it from the remaining time and recurse, starting from the same index so blocks can repeat but I never go back to smaller ones. That rules out reordered duplicates. I record when the remaining time hits exactly zero, and since the list is sorted I break as soon as a block overshoots. It's exponential in the worst case, and if they only wanted the count I'd switch to DP."
