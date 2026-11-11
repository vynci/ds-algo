# Tutorial: Zero-Sum Trades

**Problem:** [problem.md](../../../problems_by_pattern/01_two_pointers/2_zero_sum_trades/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#15 3Sum](https://leetcode.com/problems/3sum/)

Find every unique triplet that sums to 0.

---

## Step 1: Brute force

Three nested loops over `i < j < k`, giving O(n³). Then you have to **de-duplicate**: sort each triplet, stringify it and put it in a `Set`. It works, but it's slow, and the de-duplication is clumsy.

## Step 2: Reduce it to a problem you already know

Fix the first number `a`. Now you need two numbers `b + c = -a`. That's **Two Sum**.

Two Sum on a **sorted** array is the classic opposite-ends two-pointer problem:

- `sum` too small? Move `left` right, to a bigger number.
- `sum` too big? Move `right` left, to a smaller number.
- Equal? Record it.

So the plan is to **sort once** (O(n log n)), then for each `a`, run a two-pointer sweep (O(n)). That's **O(n²)** in total.

## Step 3: Duplicates, the part people get wrong

Sorting puts equal values next to each other, which makes duplicates easy to skip. There are **two** places to do it:

1. **The outer loop.** If `sorted[i] === sorted[i - 1]`, this `a` would find exactly the same triplets as the previous one, so `continue`.
2. **After recording an answer.** Move `left` past every copy of the `b` you just used. (`right` doesn't need its own loop. With `a` and `b` both fixed, `c` is forced, so a duplicate `c` can't produce a new triplet.)

## Step 4: Trace the example

`trades = [-1, 0, 1, 2, -1, -4]`, so `sorted = [-4, -1, -1, 0, 1, 2]`

**i = 0, a = -4** (we need b + c = 4)

| left | right | sum            | action  |
| ---- | ----- | -------------- | ------- |
| -1   | 2     | -4-1+2 = -3    | `left++` |
| -1   | 2     | -3             | `left++` |
| 0    | 2     | -2             | `left++` |
| 1    | 2     | -1             | `left++`, pointers meet |

There's no triplet with -4.

**i = 1, a = -1** (we need b + c = 1)

| left | right | sum | action |
| ---- | ----- | --- | ------ |
| -1 (idx 2) | 2 | 0 | ✅ record `[-1, -1, 2]`, move both |
| 0 (idx 3)  | 1 | 0 | ✅ record `[-1, 0, 1]`, move both, pointers cross |

**i = 2, a = -1:** the same value as before, so **skip**.

**i = 3, a = 0:** `0 + 1 + 2 = 3`, which is too big, so `right--` and the pointers meet. Done.

The result is `[[-1, -1, 2], [-1, 0, 1]]` ✓

## Complexity

- **Time O(n²):** n choices of `a`, times an O(n) sweep. Sorting's O(n log n) is smaller.
- **Space:** O(n) for the sorted copy, plus the output.

## Pitfalls

- **Sorting the input in place.** The `does not mutate input` test catches this. Use `[...trades].sort(...)`.
- `.sort()` without a comparator sorts numbers as **strings**: `[10, 9, 1, -5].sort()` gives `[-5, 1, 10, 9]`.
- Skipping duplicates *before* recording, or letting the skip loop run past `right`.
- The `heavy duplicates` test (`[-1, -1, -1, 2, 2, 2, 0, 1, 1]`) catches a missing skip.

## Follow-up answers

1. **An early stop:** once `a > 0`, everything after it is positive, so `break`. That's already in the solution.
2. **A hash set instead of two pointers:** for each `a`, scan the rest with a `Set` of seen values. It's still O(n²), but it needs extra memory, and de-duplication gets harder because there's no sorted order. Two pointers is the cleaner answer.
3. **k-Sum:** recursion. kSum fixes one number and calls (k−1)Sum on the rest, with 2Sum (two pointers) as the base case. That's O(n^(k−1)).

## Say it in the interview

> "Brute force is O(n³). I'll sort a copy, fix the first number, and then it's Two Sum on a sorted array, which two pointers solves in O(n), so O(n²) overall. Sorting also makes duplicates adjacent, so I skip repeated first numbers and, after each match, repeated second numbers."
