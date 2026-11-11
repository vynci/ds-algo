# Feature Flag Combos

> **Pattern:** Backtracking (subsets). **LeetCode:** [#78 Subsets](https://leetcode.com/problems/subsets/) (Medium)

Your app has a handful of **feature flags**. Before a release, QA wants to test **every possible combination of flags turned on**, from "none on" to "all on".

Write `allFlagCombos(flags)`. It takes an array of **unique** flag names and returns every subset.

- Include the empty combination `[]`, where every flag is off.
- Within each combination, keep flags in the **same order as the input**.
- The order of the combinations in the result doesn't matter.
- There should be no duplicate combinations: `["a", "b"]` and `["b", "a"]` are the same combination, so only `["a", "b"]` should appear.

## Example

```js
allFlagCombos(["dark_mode", "beta_search"])
// [
//   [],
//   ["dark_mode"],
//   ["beta_search"],
//   ["dark_mode", "beta_search"],
// ]
```

## Target

O(n · 2ⁿ). There are 2ⁿ subsets and each takes up to n to copy. You can't beat this, because the output itself is that big.

<details>
<summary>Hint</summary>

**Every** path through the decision tree is a valid subset, not just the leaves. So record `path` at the start of every call, then loop over the remaining flags (from `start` onwards): choose one, recurse, un-choose.

Alternative view: for each flag, make a yes/no decision, include it or not. That gives a binary tree of depth n.

</details>

## Follow-ups

1. Solve it **without recursion**: start with `[[]]`, and for each flag, add a copy of every existing subset with that flag appended. Or use the bits of the numbers `0` to `2ⁿ - 1`.
2. Flags may now contain **duplicates** ([#90 Subsets II](https://leetcode.com/problems/subsets-ii/)). How do you avoid duplicate combos?
3. Only combinations of **exactly k** flags ([#77 Combinations](https://leetcode.com/problems/combinations/)). Where do you prune?
4. In practice, 30 flags gives a billion combos. What would you tell QA? (Pairwise testing.)
