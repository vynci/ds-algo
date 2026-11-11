# Zero-Sum Trades

> **Pattern:** Two Pointers inside a loop. **LeetCode:** [#15 3Sum](https://leetcode.com/problems/3sum/) (Medium)

A trading desk records each trade's profit or loss as an integer: positive for a gain, negative for a loss. Compliance wants every combination of **three trades that exactly cancel out** (sum to `0`).

Write `zeroSumTrios(trades)`. It returns every **unique** triplet `[a, b, c]` of values from `trades` where `a + b + c === 0`.

- The three trades must be at **different indexes**, though their *values* can repeat (`[-1, -1, 2]` is fine if `-1` appears twice).
- Each triplet is sorted ascending: `[-1, 0, 1]`, not `[0, -1, 1]`.
- **No duplicate triplets** in the result.
- The order of the triplets in the result doesn't matter.
- **Don't change the caller's array.**

## Example

```
trades: [-1, 0, 1, 2, -1, -4]
answer: [[-1, -1, 2], [-1, 0, 1]]
```

## Target

O(n²) time. The brute force with three nested loops is O(n³), and getting rid of its duplicates is painful.

<details>
<summary>Hint</summary>

Sort a copy. Fix the first number `a` with a loop. Now you need two numbers in the rest of the array that sum to `-a`. In a **sorted** array that's a two-pointer problem. Then work out where duplicates can sneak in. There are **two** places to skip them.

</details>

## Follow-ups

1. Can you stop the outer loop early? (Once `a > 0`, what's left?)
2. Do it with a `Set`/hash map instead of two pointers. What are the trade-offs?
3. [#16 3Sum Closest](https://leetcode.com/problems/3sum-closest/), and [#18 4Sum](https://leetcode.com/problems/4sum/). How does the pattern generalize to k-Sum?
