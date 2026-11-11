# Tutorial: Rotated Sensor Log

**Problem:** [problem.md](../../../problems_by_pattern/03_binary_search/1_rotated_sensor_log/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#33 Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)

Find a value in a sorted array that has been rotated, in O(log n).

---

## Step 1: Brute force

`readings.indexOf(target)` is O(n). It's correct, but the problem requires O(log n). The test wraps the array in a `Proxy` that counts reads, and a linear scan reads all 100,000 elements.

## Step 2: Why normal binary search breaks

Normal binary search asks "is the target left or right of `mid`?" by comparing with `arr[mid]`. That only works if the whole range is sorted. A rotated array has a **seam**:

```
[4, 5, 6, 7 | 0, 1, 2]
            ^ seam: the only place where the next value is smaller
```

## Step 3: The insight, one half is always sorted

There's only **one** seam, and `mid` splits the range in two, so the seam is in **at most one** half. The other half is a normal sorted run.

How to tell which half is sorted: **if `arr[lo] <= arr[mid]`, the left half is sorted.** If the seam were in the left half, `arr[lo]` would be *bigger* than `arr[mid]`.

Then, for the sorted half, you know its exact range `[first, last]`, so you can check **"is the target inside it?"** with two comparisons:

- **Inside:** search that half.
- **Not inside:** it can only be in the other half, the one with the seam. That's fine, because next iteration we split that half again, and again one side will be sorted.

## Step 4: Trace the example

`readings = [4, 5, 6, 7, 0, 1, 2]`, `target = 0`

| lo | hi | mid | values (lo, mid, hi) | sorted half         | target in it? | next     |
| -- | -- | --- | -------------------- | ------------------- | ------------- | -------- |
| 0  | 6  | 3   | 4, 7, 2              | left [4..7] (4 ≤ 7) | 0 in [4, 7)? no | `lo = 4` |
| 4  | 6  | 5   | 0, 1, 2              | left [0..1] (0 ≤ 1) | 0 in [0, 1)? **yes** | `hi = 4` |
| 4  | 4  | 4   | 0                    | none                | `arr[4] === 0` | return **4** ✓ |

That's 3 steps for 7 elements, and about 17 steps for 100,000.

## Step 5: The boundary details

```js
if (loVal <= midVal)  // <= not <: when lo === mid (2 elements left), the "left half" is just one element, which is sorted
  if (loVal <= target && target < midVal)  // < midVal: we already know target !== midVal
```

Getting `<=` vs `<` wrong usually shows up on **2-element arrays**. That's why the tests include `[3, 1]` and `[5, 1, 3]`.

## Complexity

- **Time O(log n):** the range halves every iteration.
- **Space O(1).**

## Pitfalls

- `loVal < midVal` instead of `<=`: it breaks when `lo === mid`.
- Forgetting the empty array: `hi = -1`, the loop never runs, and you return -1. That's handled for free.
- Mixing templates: this uses `while (lo <= hi)` with `mid ± 1`. Don't combine it with `hi = mid`.

## Follow-up answers

1. **Find the smallest value (#153):** compare `arr[mid]` with `arr[hi]`. If `arr[mid] > arr[hi]`, the seam is to the right: `lo = mid + 1`. Otherwise `hi = mid`.
2. **Duplicates (#81):** when `arr[lo] === arr[mid] === arr[hi]`, you can't tell which half is sorted. Shrink with `lo++` and `hi--`. The worst case becomes **O(n)**, for example `[1, 1, 1, 1, 0, 1, 1]`.
3. **Find the seam first, then search:** two clean O(log n) binary searches. It's easier to get right under pressure. The one-pass version is shorter. Both are fine to present.

## Say it in the interview

> "A rotated sorted array has one seam, so whichever way I split at mid, one half is fully sorted. I identify it by comparing the left end with mid. If the target lies within that sorted half's range, I go there, otherwise I go to the other half. I'm still halving every step, so it's O(log n)."
