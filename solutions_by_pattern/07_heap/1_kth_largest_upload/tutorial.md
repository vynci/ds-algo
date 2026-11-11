# Tutorial: Kth Largest Upload

**Problem:** [problem.md](../../../problems_by_pattern/07_heap/1_kth_largest_upload/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#215 Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

Build a min-heap, then use it to find the k-th largest value in O(n log k).

---

# Part 1: Building the MinHeap

## Step 1: The shape, a tree stored in an array

A binary heap is a **complete binary tree**: every level is full except possibly the last, which fills from the left. That shape fits perfectly into an array with no gaps:

```
array:  [ 1,  3,  2,  7,  4,  5 ]
index:    0   1   2   3   4   5

              1 (0)                 parent(i) = Math.floor((i - 1) / 2)
            /       \               left(i)   = 2i + 1
        3 (1)       2 (2)           right(i)  = 2i + 2
        /   \       /
    7 (3)  4 (4)  5 (5)
```

**The heap rule (min-heap):** every parent is ≤ its children. So the **smallest item is always at index 0**. The rest is only *partly* ordered, and that's what makes it cheap to maintain.

## Step 2: `push`, add then bubble up

Add the new item as the last leaf (the end of the array). It may be smaller than its parent, so **swap upward** until the parent is smaller, or we reach the root.

`push(0)` into `[1, 3, 2, 7, 4, 5]`:

```
[1, 3, 2, 7, 4, 5, 0]   0 is at index 6, parent 2 (value 2): 0 < 2, swap
[1, 3, 0, 7, 4, 5, 2]   0 is at index 2, parent 0 (value 1): 0 < 1, swap
[0, 3, 1, 7, 4, 5, 2]   0 is at the root: done
```

The tree has log₂(n) levels, so this is **O(log n)**.

## Step 3: `pop`, take the root then sink down

The root is the answer. To fill the hole, **move the last leaf to the root**, which keeps the shape complete, then **sink it down**: swap with its **smaller child** until both children are ≥ it.

`pop()` from `[0, 3, 1, 7, 4, 5, 2]`:

```
return 0. Move the last item (2) to the root: [2, 3, 1, 7, 4, 5]
2 vs children 3 and 1: the smaller child is 1 (index 2), and 1 < 2, so swap -> [1, 3, 2, 7, 4, 5]
2 at index 2 vs child 5 (index 5): 2 < 5, done
```

**Why the *smaller* child?** It becomes the parent of the other child, so it must be ≤ that child. Swapping with the bigger one would break the rule.

**Edge case:** popping the **last** item. After `items.pop()` the array is empty, so there's no root to move into. The `if (items.length > 0)` handles it.

## Step 4: The comparator

`compare(a, b)` uses the same contract as `sort`: negative means `a` comes out first. So the "min"-heap becomes:

- a max-heap: `new MinHeap((a, b) => b - a)`
- an object heap: `new MinHeap((a, b) => a.mb - b.mb)`

One class covers everything, and the heap problems in `08_shortest_path` reuse it.

---

# Part 2: `kthLargest`

## Step 5: Three approaches

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Sort descending, take index k−1 | O(n log n) | O(n) | Simplest. Say it first |
| Max-heap of everything, pop k times | O(n + k log n) | O(n) | Not better in the worst case |
| **Min-heap of size k** | **O(n log k)** | **O(k)** | ✅ The intended answer |
| Quickselect | O(n) average, O(n²) worst | O(1) | Follow-up 4 |

## Step 6: Why a **min**-heap for the **largest** (the key insight)

We want to remember the k biggest values seen so far. When a new value arrives, the one to throw out is the **smallest of those k**. A min-heap keeps exactly that one on top, ready to be removed.

At the end, the heap holds the k largest values, and its top, the smallest of them, **is the k-th largest**.

## Step 7: Trace `[3, 2, 1, 5, 6, 4]`, k = 2

| value | heap after push | size > 2? | heap after (holds the top 2 so far) |
| ----- | --------------- | --------- | ----------------------------------- |
| 3     | [3]             | no        | [3]                                 |
| 2     | [2, 3]          | no        | [2, 3]                              |
| 1     | [1, 3, 2]       | yes, pop 1 | [2, 3]                             |
| 5     | [2, 3, 5]       | yes, pop 2 | [3, 5]                             |
| 6     | [3, 5, 6]       | yes, pop 3 | [5, 6]                             |
| 4     | [4, 6, 5]       | yes, pop 4 | [5, 6]                             |

`peek()` is **5** ✓

## Complexity

- **Time O(n log k):** n pushes and pops on a heap that never exceeds k + 1 items.
- **Space O(k).**

## Pitfalls

- Sorting inside `push`. It's correct but O(n log n) per push. The 100k test catches it.
- Swapping with the **left** child instead of the **smaller** child.
- Index formulas: the parent is `Math.floor((i - 1) / 2)`, **not** `i / 2`, because the array is 0-indexed.
- Popping when size is 1 (the `pop down to empty and reuse` test).

## Follow-up answers

1. **Why a min-heap:** its top is the weakest of the current top k, which is exactly the one to evict when something bigger arrives.
2. **When sorting is fine:** small n, or a one-off script. O(n log k) wins when n is huge and k is small (top 10 of 10 million), or when the data is a **stream** you can't hold in memory.
3. **A stream (#703):** keep the same size-k min-heap as a class field. Each new value costs O(log k), and the answer is always `peek()`.
4. **Quickselect:** partition like quicksort, but recurse only into the side containing index k. That's O(n) on average, but O(n²) in the worst case on bad pivots. A heap gives guaranteed O(n log k), works on streams, and doesn't reorder the input.

## Say it in the interview

> "I'll keep a min-heap capped at size k. For each size I push it, and if the heap grows past k I pop the smallest. The heap always holds the k largest seen so far, and its top is the k-th largest. That's O(n log k) time and O(k) space. JavaScript has no built-in heap, so I'll implement one: an array-backed binary tree with bubble-up on push and sink-down on pop."
