# Binary Search

## The idea

If you can look at the middle of a range and **rule out half of it**, you can find what you want in O(log n) steps. For a million items that's about 20 steps.

It isn't only "find a number in a sorted array". It works on anything with a **monotonic yes/no question**: a line where everything on one side answers "no" and everything on the other answers "yes".

```
index:     0   1   2   3   4   5   6   7
question:  no  no  no  no  YES YES YES YES
                           ^ find this boundary
```

There are two common shapes:

| Shape                      | Search over          | Example                                                            |
| -------------------------- | -------------------- | ------------------------------------------------------------------ |
| **Search an array**        | Indexes              | Find a target, find an insert position, rotated arrays             |
| **Search the answer space** | Possible answers (speed, capacity, days...) | "Smallest speed that finishes in time", "minimum ship capacity" |

## When to recognize it

- The input is **sorted**, or sorted in pieces (rotated).
- The problem asks for O(log n), or n is huge (10⁹).
- **"Minimum X such that…" or "maximum X such that…"**, where checking one candidate X is easy. If X works, every bigger X also works (or every smaller one). That's binary search on the answer.

## Template: find the first "yes" (the most useful one to memorize)

```js
let lo = minPossible;
let hi = maxPossible;        // hi must be a known "yes"
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (isYes(mid)) hi = mid;  // mid might be the answer, so keep it
  else lo = mid + 1;         // mid is definitely not it
}
return lo;                   // lo === hi === the first "yes"
```

## Template: exact match in a sorted array

```js
let lo = 0;
let hi = arr.length - 1;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return -1;
```

## Complexity

- Searching an array: O(log n).
- Searching the answer space: O(log(range) × cost of checking one candidate).

## Common bugs

- **Infinite loops.** With `while (lo < hi)` and `hi = mid`, `mid` must round **down**. With `lo = mid` instead, round **up**. Mixing them up loops forever on 2 elements.
- `<` vs `<=` and `mid - 1` vs `mid`: choose a template and stick to it. Don't improvise.
- Wrong bounds on the answer space: `hi` must be a value you *know* works.
- Integer division: `Math.floor`, and `Math.ceil` for "pages per hour" style rounding up.

## Problems

| #   | Problem                                              | LeetCode                                                                                     | Level  |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| 1   | [Rotated Sensor Log](1_rotated_sensor_log/problem.md) | [#33 Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium |
| 2   | [Minimum Reading Speed](2_min_reading_speed/problem.md) | [#875 Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)            | Medium |

**Warm-up:** [#704 Binary Search](https://leetcode.com/problems/binary-search/), [#35 Search Insert Position](https://leetcode.com/problems/search-insert-position/). **More:** [#153 Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/), [#1011 Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/).
