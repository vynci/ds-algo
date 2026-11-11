# Fill the Workout

> **Pattern:** Backtracking with reuse + pruning. **LeetCode:** [#39 Combination Sum](https://leetcode.com/problems/combination-sum/) (Medium)

A fitness app builds workouts from exercise **blocks**. Each block has a fixed length in minutes, for example a 5-minute warm-up, a 10-minute run or a 15-minute circuit. A user has exactly `minutes` free and wants every way to **fill that time exactly**.

Write `workoutPlans(blocks, minutes)`:

- `blocks` holds **unique** positive integers (block lengths), in any order.
- Each block length can be used **any number of times**.
- Return every unique combination of block lengths that adds up to **exactly** `minutes`.
- The plans `[5, 10]` and `[10, 5]` are the **same** plan, so include it only once.
- The order of plans, and of the numbers inside each plan, doesn't matter.
- `minutes` is at least 1. If nothing fits, return `[]`.

## Example

```js
workoutPlans([2, 3, 6, 7], 7)
// [[2, 2, 3], [7]]

workoutPlans([2, 3, 5], 8)
// [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
```

## Target

This is exponential in the worst case, which is unavoidable. **Prune** so you never explore a branch that's already over `minutes`.

<details>
<summary>Hint</summary>

It's the subsets template with two changes. (1) Pass `remaining` minutes down, and record the plan when it reaches exactly 0. (2) Recurse with `i`, not `i + 1`, so the same block can be picked again. You still never go *back* to earlier blocks, and that's what prevents `[3, 2]` after `[2, 3]`. If you **sort** the blocks first, you can `break` as soon as a block is too big.

</details>

## Follow-ups

1. Explain why recursing with `i` (not `0`) avoids duplicate plans.
2. Each block can be used **at most once**, and `blocks` may contain duplicates: [#40 Combination Sum II](https://leetcode.com/problems/combination-sum-ii/).
3. Return only the **number** of plans, for `minutes` up to 10,000. Backtracking is too slow there. (Dynamic programming: this is [#518 Coin Change II](https://leetcode.com/problems/coin-change-ii/).)
4. Return the plan with the **fewest blocks**. (BFS or DP: [#322 Coin Change](https://leetcode.com/problems/coin-change/).)
