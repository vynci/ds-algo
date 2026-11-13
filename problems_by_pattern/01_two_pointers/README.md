# Two Pointers

## The idea

Keep two indexes into the same array and move them according to a rule, so that **each element is visited at most once or twice**. That turns an O(n²) "check every pair" brute force into O(n).

There are two common shapes:

| Shape                   | Pointers start at   | Typical use                                             |
| ----------------------- | ------------------- | ------------------------------------------------------- |
| **Opposite ends**       | `0` and `n - 1`, moving inward | Sorted arrays (pair sums), palindromes, "pick two walls" |
| **Same direction** (fast/slow) | Both at `0`, one ahead | Remove duplicates in place, partitioning, linked-list cycles |

## When to recognize it

- The input is **sorted**, or you're allowed to sort it.
- You're looking for a **pair** (or triplet) that satisfies a condition.
- "In place" or "O(1) extra space".
- Comparing from both ends (palindromes, reversing).

## Template: opposite ends

```js
let left = 0;
let right = arr.length - 1;
while (left < right) {
  const value = combine(arr[left], arr[right]);
  if (value === target) { /* record the answer, then move one or both pointers */ }
  else if (value < target) left++;  // need bigger, so move the small side up
  else right--;                     // need smaller, so move the big side down
}
```

**The key question for every two-pointer problem:** *why is it safe to throw away the element you move past?* If you can say that out loud, the solution is correct. If you can't, it probably isn't.

## Complexity

- O(n) for a single pass, or O(n log n) if you sort first.
- Pointer-in-a-loop problems such as 3Sum: O(n²), down from O(n³).

## Common bugs

- `left <= right` vs `left < right`. Ask whether one element by itself can be a valid answer.
- Sorting the caller's array in place, because `sort` mutates. Copy first: `[...arr].sort(...)`.
- Forgetting `(a, b) => a - b`. A plain `.sort()` sorts numbers as strings.
- Skipping duplicates: do it **after** recording an answer, and make sure you don't run past the other pointer.

## Problems

| #   | Problem                                    | LeetCode                                                                                  | Level  |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------- | ------ |
| 1   | [Rain Catcher](1_rain_catcher/problem.md)  | [#11 Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Medium |
| 2   | [Zero-Sum Trades](2_zero_sum_trades/problem.md) | [#15 3Sum](https://leetcode.com/problems/3sum/)                                       | Medium |
| 3   | [Mirror Labels](3_mirror_labels/problem.md) | [#125 Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) + [#680 Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) | Easy+ |

**Warm-ups** if these feel hard: [#344 Reverse String](https://leetcode.com/problems/reverse-string/), [#167 Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/). Problem 3 (Mirror Labels) is also a gentler start than 1 and 2.
