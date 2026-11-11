# Rain Catcher

> **Pattern:** Two Pointers (opposite ends). **LeetCode:** [#11 Container With Most Water](https://leetcode.com/problems/container-with-most-water/) (Medium)

A farmer has a row of wooden posts, spaced exactly 1 metre apart. `heights[i]` is the height of post `i`. They want to stretch a tarp between **two** posts to collect rainwater. The water level can't rise above the **shorter** of the two posts, and the width is the distance between them.

```
water(i, j) = min(heights[i], heights[j]) * (j - i)
```

Write `maxWater(heights)`. It returns the most water any pair of posts can hold. The posts in between don't get in the way.

- With fewer than 2 posts, return `0`.
- Heights are non-negative integers.

## Example

```
heights: [1, 8, 6, 2, 5, 4, 8, 3, 7]
answer:  49   (posts at index 1 and 8: min(8, 7) * (8 - 1) = 49)
```

## Target

O(n) time, O(1) space. The brute force that checks every pair is O(n²). Write that first if it helps, then improve it.

<details>
<summary>Hint</summary>

Start with the widest pair: the first and last posts. Moving a pointer inward always loses width. So which pointer could *possibly* lead to more water: the taller post or the shorter one? Why can you safely discard the other?

</details>

## Follow-ups

1. Explain **why** moving the shorter post never skips the best answer. Interviewers ask this.
2. If both posts are the same height, does it matter which one you move?
3. Related but different: [#42 Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) (Hard), where every post holds water.
