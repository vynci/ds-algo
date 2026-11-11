# Kth Largest Upload

> **Pattern:** Priority Queue (min-heap of size k). **LeetCode:** [#215 Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) (Medium), plus building the heap yourself.

A file-hosting service wants to flag unusually large uploads. Given today's upload sizes in MB, find the **k-th largest**.

This problem has two parts. Part 1 is the reusable tool. Part 2 uses it.

## Part 1: Build a `MinHeap`

JS has no built-in heap, so write one:

```js
const heap = new MinHeap();               // default: smallest number on top
const maxHeap = new MinHeap((a, b) => b - a); // a comparator, same contract as sort()

heap.push(5);
heap.push(2);
heap.peek(); // 2  (doesn't remove it)
heap.pop();  // 2  (removes it)
heap.size;   // 1  (a getter, not a method)
```

- `pop()` and `peek()` on an empty heap return `undefined`.
- `push` and `pop` must be O(log n), so **don't** sort an array internally.
- The comparator lets it hold objects too: `new MinHeap((a, b) => a.size - b.size)`.

See the [heap README](../README.md) for how bubble-up and sink-down work.

## Part 2: `kthLargest(sizes, k)`

Return the k-th largest value in `sizes`. Duplicates count separately, so in `[7, 7, 7]` the 2nd largest is `7`.

- `1 <= k <= sizes.length`.
- **Target:** O(n log k) time and O(k) extra space, using your heap.
- Don't change `sizes`.

## Example

```js
kthLargest([3, 2, 1, 5, 6, 4], 2)          // 5
kthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) // 4
```

<details>
<summary>Hint</summary>

Keep a **min**-heap of the k largest sizes seen so far. Its top is the *smallest* of those k, which is your current k-th largest. For each new size: push it, and if the heap now has more than k items, pop the smallest. When you're done, the top is the answer.

</details>

## Follow-ups

1. Why a **min**-heap for the k **largest**? Explain it in one sentence.
2. Sorting gives O(n log n). When is that actually fine? When is O(n log k) a real win?
3. Sizes arrive as a **stream** and you need the k-th largest after every upload: [#703](https://leetcode.com/problems/kth-largest-element-in-a-stream/).
4. **Quickselect** gets O(n) on average. What's its worst case, and why might you still pick the heap?
