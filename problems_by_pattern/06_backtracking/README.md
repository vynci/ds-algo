# Backtracking

## The idea

Backtracking builds answers **one choice at a time**. At each step you **choose** something, **explore** everything that follows from that choice (by recursing), then **undo** the choice and try the next option. It's DFS over a tree of *decisions* rather than over a graph you were given.

```
                    []
          /         |          \
       [a]         [b]         [c]          <- choose the 1st item
      /   \         |
   [a,b] [a,c]    [b,c]                     <- choose the next item (only later ones)
     |
  [a,b,c]
```

**Pruning** is what makes it practical. Stop exploring a branch as soon as you know it can't lead to a valid answer, for example when the running total is already over the target.

## When to recognize it

- "Return **all** possible…": combinations, subsets, permutations, partitions, arrangements.
- Puzzles with constraints: N-Queens, Sudoku, word search.
- The output itself is exponential in size, so there's no way around exploring it all. A faster *algorithm* isn't possible, only a smarter search.

If the question asks for the **count** or the **best** answer rather than *all* answers, consider dynamic programming instead. That's a common follow-up.

## Template: choose, explore, un-choose

```js
function solve(input) {
  const results = [];
  const path = [];

  function backtrack(start /*, other state like remaining */) {
    if (isComplete(path)) {
      results.push([...path]);   // COPY: path keeps changing after this
      return;                    // (some problems record and keep going instead)
    }
    for (let i = start; i < input.length; i++) {
      if (cannotWork(input[i])) continue;  // or `break` if the input is sorted
      path.push(input[i]);                 // choose
      backtrack(i + 1);                    // explore (i + 1: no reuse; i: reuse allowed)
      path.pop();                          // un-choose
    }
  }

  backtrack(0);
  return results;
}
```

### `start` controls duplicates

| You want                                   | Recurse with                     |
| ------------------------------------------ | -------------------------------- |
| Combinations or subsets, each item once    | `backtrack(i + 1)`               |
| Combinations where items can be **reused** | `backtrack(i)`                   |
| Permutations (order matters)               | Loop from 0 every time, skip items already used |

Passing `start` is what stops `[2, 3]` and `[3, 2]` both appearing. You only ever pick items at or after the last one you picked.

## Complexity

It's exponential by nature: O(2ⁿ) for subsets, O(n!) for permutations, roughly O(branches^depth) for combination sums. Say this in interviews, and explain how pruning helps in practice.

## Common bugs

- **`results.push(path)` without copying.** Every result ends up pointing at the same (eventually empty) array. Use `[...path]`.
- Forgetting to undo (`path.pop()`), or undoing in the wrong place.
- Duplicates such as `[2, 3]` and `[3, 2]` from looping from 0 instead of `start`.
- No pruning: correct, but it times out on bigger inputs.

## Problems

| #   | Problem                                               | LeetCode                                                                 | Level  |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------ | ------ |
| 1   | [Feature Flag Combos](1_feature_flag_combos/problem.md) | [#78 Subsets](https://leetcode.com/problems/subsets/)                  | Medium |
| 2   | [Fill the Workout](2_fill_the_workout/problem.md)     | [#39 Combination Sum](https://leetcode.com/problems/combination-sum/)   | Medium |

**More:** [#46 Permutations](https://leetcode.com/problems/permutations/), [#90 Subsets II](https://leetcode.com/problems/subsets-ii/), [#79 Word Search](https://leetcode.com/problems/word-search/), [#17 Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/).
