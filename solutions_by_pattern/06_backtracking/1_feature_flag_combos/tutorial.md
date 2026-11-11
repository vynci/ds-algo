# Tutorial: Feature Flag Combos

**Problem:** [problem.md](../../../problems_by_pattern/06_backtracking/1_feature_flag_combos/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#78 Subsets](https://leetcode.com/problems/subsets/)

Return every subset of a list of unique flags.

---

## Step 1: How many answers?

Each flag is either **on or off**, so with n flags there are **2ⁿ** combinations. With 10 flags that's 1,024. Since we must *return* all of them, no algorithm can be faster than the output's size. The goal isn't speed. It's **generating each combination exactly once**, cleanly.

## Step 2: Picture the decision tree

Build combinations by adding flags one at a time, **only choosing flags that come after the last one you picked**:

```
                         []
             /           |          \
          [a]           [b]         [c]
         /   \           |
     [a,b]  [a,c]      [b,c]
       |
    [a,b,c]
```

- **Every node** is a valid combination, including the root `[]`. So we record at **every** call, not only at the leaves.
- "Only flags after the last one" is what prevents `[b, a]`: from `[b]` we never look back at `a`.

## Step 3: The backtracking template

```js
function backtrack(start) {
  combos.push([...path]);            // record this node (a COPY)
  for (let i = start; i < flags.length; i++) {
    path.push(flags[i]);             // choose
    backtrack(i + 1);                // explore: only later flags
    path.pop();                      // un-choose: undo before trying the next option
  }
}
```

**Choose, explore, un-choose** is the rhythm of every backtracking problem. `path` is one array that we keep changing in place. That's why we must push a **copy** when recording.

## Step 4: Trace `["a", "b", "c"]`

| call (start) | path before loop | recorded  | loop tries                     |
| ------------ | ---------------- | --------- | ------------------------------ |
| bt(0)        | []               | `[]`      | a, b, c                        |
| ↳ bt(1)      | [a]              | `[a]`     | b, c                           |
|   ↳ bt(2)    | [a, b]           | `[a,b]`   | c                              |
|     ↳ bt(3)  | [a, b, c]        | `[a,b,c]` | none (start = 3), return       |
|   ↳ bt(3)    | [a, c]           | `[a,c]`   | none                           |
| ↳ bt(2)      | [b]              | `[b]`     | c                              |
|   ↳ bt(3)    | [b, c]           | `[b,c]`   | none                           |
| ↳ bt(3)      | [c]              | `[c]`     | none                           |

That's 8 combos, 2³ ✓

## Step 5: The "forgot to copy" bug

```js
combos.push(path);   // ❌ pushes a REFERENCE to the one shared array
```

Every entry in `combos` is then the **same** array. When the recursion finishes, `path` is back to `[]`, so you get `[[], [], [], …]`. The `combos are independent copies` test catches exactly this. Always use `[...path]`.

## Step 6: Two non-recursive alternatives (follow-up 1)

**Doubling:** start with `[[]]`. For each flag, add a copy of every existing combo with that flag appended:

```
[[]]  -> +a ->  [[], [a]]  -> +b ->  [[], [a], [b], [a,b]]  -> ...
```

**Bitmasks:** the numbers `0` to `2ⁿ − 1` written in binary *are* the on/off patterns. Bit `i` set means flag `i` is on. Both versions are in [solution.js](solution.js).

## Complexity

- **Time O(n · 2ⁿ):** 2ⁿ combos, each copied in up to O(n).
- **Space O(n · 2ⁿ)** for the output, plus O(n) recursion depth.

## Follow-up answers

1. **Without recursion:** Step 6.
2. **Duplicate flags (#90):** sort first. Then, in the loop, skip `flags[i]` if `i > start && flags[i] === flags[i - 1]`. That stops the same value being chosen twice *in the same position*.
3. **Exactly k flags (#77):** record only when `path.length === k`, and **prune**: stop the loop when there aren't enough flags left to reach k.
4. **30 flags is about a billion combos:** you can't test them all. Suggest **pairwise (all-pairs) testing**, which covers every pair of flag values with a small number of runs. Most bugs come from interactions between one or two flags.

## Say it in the interview

> "There are 2ⁿ subsets, so I'll generate them with backtracking. A recursive function records the current path, then for each remaining flag after the last chosen one, it chooses it, recurses, and un-chooses it. Only looking forward prevents reordered duplicates. I push a copy of the path each time. O(n · 2ⁿ), which is optimal because that's the output size."
