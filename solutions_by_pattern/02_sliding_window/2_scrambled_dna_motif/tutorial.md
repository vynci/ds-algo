# Tutorial: Scrambled DNA Motif

**Problem:** [problem.md](../../../problems_by_pattern/02_sliding_window/2_scrambled_dna_motif/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#438 Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)

Find every start index where a window of the genome has the same letter counts as the motif.

---

## Step 1: Brute force

For each start index `i`, take `genome.slice(i, i + k)` and compare it with the motif, either by sorting both or by counting both. Each check costs O(k), so the total is **O(n · k)**. The waste: consecutive windows share k − 1 letters, but we recount all of them.

## Step 2: Fixed-size sliding window

Every candidate has length **exactly k**, so the window size never changes. Moving from window `i` to window `i + 1` means:

- **add** the letter entering on the right, `genome[right]`
- **remove** the letter leaving on the left, `genome[right - k]`

That's two count updates per step instead of k.

## Step 3: Checking "same counts" cheaply

**Option A (simple, and fine here):** compare the 4 counts (A, C, G, T) at every step. That's O(4) = O(1), because the alphabet is fixed. In an interview, write this first and *say* it's O(alphabet).

**Option B (what the solution does):** keep a counter `matched`, the number of distinct motif letters whose count in the window is **exactly** right. Update it only when a count crosses the "exact" line:

```
before the change: was it exact?  ->  matched--
after the change:  is it exact?   ->  matched++
```

The window is a match when `matched === need.size`. Every step is now O(1) **whatever the alphabet size**, which is the answer to follow-up 1 and handles Unicode (follow-up 3).

## Step 4: Trace the example

`genome = "ACGTCAGT"`, `motif = "CAG"`, so `need = {C: 1, A: 1, G: 1}` and `need.size = 3`

| right | in | out | window | have (A, C, G)  | matched | full? | match?  |
| ----- | -- | --- | ------ | --------------- | ------- | ----- | ------- |
| 0     | A  | none | A      | 1, 0, 0         | 1       | no    |         |
| 1     | C  | none | AC     | 1, 1, 0         | 2       | no    |         |
| 2     | G  | none | ACG    | 1, 1, 1         | **3**   | yes   | ✅ **0** |
| 3     | T  | A   | CGT    | 0, 1, 1         | 2       | yes   |         |
| 4     | C  | C   | GTC    | 0, 1, 1         | 2       | yes   |         |
| 5     | A  | G   | TCA    | 1, 1, 0         | 2       | yes   |         |
| 6     | G  | T   | CAG    | 1, 1, 1         | **3**   | yes   | ✅ **4** |
| 7     | T  | C   | AGT    | 1, 0, 1         | 2       | yes   |         |

`T` isn't in the motif, so `add` and `remove` ignore it. The answer is `[0, 4]` ✓

At step 4, C enters and C leaves in the same step. `matched` dips and comes back, and the count ends where it started. The order of add-then-remove doesn't matter, because we only check *after* both.

## Complexity

- **Time O(n):** one pass, with O(1) work per step.
- **Space O(distinct motif letters):** at most 4 here.

## Pitfalls

- Off-by-one: the first full window ends at `right = k - 1` and starts at `right - k + 1`.
- Forgetting overlapping matches. `"AAAA"` with `"AA"` gives `[0, 1, 2]`.
- Comparing **sets of letters** instead of **counts**. `"AACC"` with `"ACC"` only matches at index 1.

## Follow-up answers

1. **O(1) per step, whatever the alphabet:** the `matched` counter in Step 3.
2. **#567 (true/false only):** the same code, returning `true` at the first match.
3. **A general alphabet:** Option B already works, because the `Map`s only hold the motif's letters.

## Say it in the interview

> "All candidates are length k, so it's a fixed-size sliding window. I count the motif's letters once, then slide the window by adding the incoming letter and removing the outgoing one. To check for a match in O(1), I track how many letters have exactly the right count. When that equals the number of distinct motif letters, I record the start. That's O(n) time."
