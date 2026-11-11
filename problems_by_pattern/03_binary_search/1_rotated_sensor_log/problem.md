# Rotated Sensor Log

> **Pattern:** Binary Search on an array. **LeetCode:** [#33 Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) (Medium)

A temperature sensor stores readings in a **circular buffer**. The readings were recorded in strictly increasing order, so they're all distinct. When the buffer wrapped around, the array ended up **rotated** at an unknown point:

```
original:  [0, 1, 2, 4, 5, 6, 7]
stored:    [4, 5, 6, 7, 0, 1, 2]    // rotated; the "seam" is between 7 and 0
```

Write `findReading(readings, target)`. It returns the **index** of `target` in `readings`, or `-1` if it isn't there.

- The array may not be rotated at all.
- It may be empty.

**You must use O(log n) time.** The tests count how many array elements you read, so `indexOf` or a linear scan will fail the last test.

## Example

```
findReading([4, 5, 6, 7, 0, 1, 2], 0)  ->  4
findReading([4, 5, 6, 7, 0, 1, 2], 3)  -> -1
```

<details>
<summary>Hint</summary>

Pick `mid`. The seam can only be on one side of it, so **at least one half, `[lo..mid]` or `[mid..hi]`, is properly sorted**. You can tell which half by comparing `arr[lo]` with `arr[mid]`. If the target falls inside the sorted half's range, go there. Otherwise go to the other half.

</details>

## Follow-ups

1. Find the **smallest reading** (the seam) in O(log n): [#153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/).
2. What breaks if readings can **repeat**, as in [#81](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/)? What's the worst case then?
3. Alternative approach: find the seam first, then run a normal binary search on the correct half. Compare the two.
