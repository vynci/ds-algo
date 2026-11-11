# Priority Queue (Heap)

## The idea

A **priority queue** always hands you the **smallest** (min-heap) or **largest** (max-heap) item, even while items keep arriving. A **binary heap** does both operations in O(log n):

| Operation           | Cost       |
| ------------------- | ---------- |
| `push(x)`           | O(log n)   |
| `pop()` (remove the top) | O(log n) |
| `peek()` (read the top)  | O(1)     |
| Build from n items  | O(n) (heapify), or O(n log n) by pushing one at a time |

Compare that with keeping a sorted array, where each insert costs O(n), or re-sorting every time, which costs O(n log n).

**JavaScript has no built-in heap.** In an interview you either write one (about 30 lines, worth memorizing) or say "assume I have a `MinHeap` with push/pop/peek" and ask if that's OK. Many interviewers allow it. Some want to see it.

## How a binary heap works

It's stored in a plain array, but treated as a **complete binary tree**:

```
index:    0   1   2   3   4   5   6
array:  [ 1,  3,  2,  7,  4,  5,  9 ]

             1            parent(i) = Math.floor((i - 1) / 2)
           /   \          left(i)   = 2 * i + 1
          3     2         right(i)  = 2 * i + 2
         / \   / \
        7   4 5   9       rule: every parent <= its children (for a min-heap)
```

- **push:** add to the end, then **bubble up**, swapping with the parent while smaller than it.
- **pop:** take the root, move the **last** item to the root, then **sink down**, swapping with the *smaller* child while bigger than it.

## When to recognize it

- "**Top k**", "**k-th** largest or smallest", "k closest".
- **Merge k** sorted things: lists, streams, files.
- "Always process the most urgent / cheapest / earliest next": schedulers, event simulation, **Dijkstra**.
- A running median, or "the smallest so far" on a stream (two heaps).

**The k trick:** to keep the **k largest**, use a **min**-heap of size k. Its top is the *weakest* of your top k, so it's the one to kick out when something better arrives. That costs O(n log k) instead of O(n log n).

## Template: using a heap with a comparator

```js
const heap = new MinHeap((a, b) => a.priority - b.priority); // same contract as sort()
heap.push({ priority: 3, task: "email" });
heap.push({ priority: 1, task: "page on-call" });
heap.pop(); // { priority: 1, task: "page on-call" }
```

Passing a comparator means the same class works as a max-heap `(a, b) => b - a` or for objects.

## Common bugs

- Off-by-one in the parent and child index formulas.
- In sink-down, swapping with the **left** child instead of the **smaller** child.
- `pop()` on a heap of size 1: move-last-to-root must handle the last element *being* the root.
- Using a max-heap for "k largest". It works, but takes O(n log n) and O(n) space. The size-k min-heap is the answer interviewers want.
- `arr.sort()` "as a heap" after every push. That's correct but O(n log n) per operation, so say why you'd avoid it.

## Problems

| #   | Problem                                                  | LeetCode                                                                                              | Level  |
| --- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------ |
| 1   | [Kth Largest Upload](1_kth_largest_upload/problem.md)    | [#215 Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) + build the heap | Medium |
| 2   | [Merge Log Streams](2_merge_log_streams/problem.md)      | [#23 Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)                       | Hard   |

**More:** [#703 Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/), [#973 K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/), [#621 Task Scheduler](https://leetcode.com/problems/task-scheduler/), [#295 Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) (Hard).
