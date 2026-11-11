# Merge Log Streams

> **Pattern:** Priority Queue, k-way merge. **LeetCode:** [#23 Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) (Hard on LeetCode because of the linked lists. With arrays it's a solid Medium.)

You run `k` servers. Each one writes its own log, already **sorted by timestamp**. For debugging, you want a single combined timeline.

Write `mergeStreams(streams)`:

- `streams` is an array of `k` arrays. Each entry is `{ ts, msg }`, and each array is sorted by `ts` ascending.
- Return **one** array with every entry, sorted by `ts` ascending.
- **Ties:** if two entries have the same `ts`, the one from the **lower stream index** comes first. Entries from the same stream keep their original order.
- Return the original entry objects. Don't copy or reshape them.
- **Don't modify** `streams` or the arrays inside it.
- Some streams may be empty, and `streams` itself may be empty.

## Example

```js
mergeStreams([
  [{ ts: 1, msg: "api: start" }, { ts: 4, msg: "api: request" }, { ts: 9, msg: "api: stop" }],
  [{ ts: 2, msg: "db: start" }, { ts: 4, msg: "db: query" }],
  [{ ts: 3, msg: "web: start" }],
]).map((e) => e.msg);
// ["api: start", "db: start", "web: start", "api: request", "db: query", "api: stop"]
```

## Target

O(N log k), where N = the total number of entries and k = the number of streams. Use the `MinHeap` from [1_kth_largest_upload](../1_kth_largest_upload/), and paste it into `index.js`.

The easy answer, "flatten everything and sort", is O(N log N), and it **passes the tests**. Write it first if you like, as a baseline. In an interview, though, the k-way merge is the point. It also works when the streams are too big to fit in memory, which flatten-and-sort doesn't.

<details>
<summary>Hint</summary>

You only ever need to compare the **current front** of each stream. Put one entry per stream into a min-heap, recording **which stream** it came from and **its index** in that stream. Pop the smallest, add it to the output, then push the **next** entry from that same stream, if it has one. The comparator needs a tie-break on the stream index.

</details>

## Follow-ups

1. Why is the heap only ever size k at most, and why does that matter?
2. Merge the streams **pairwise**, divide-and-conquer style (1+2, 3+4, … then repeat). What's the complexity? How does it compare?
3. The streams are huge files on disk, and the output goes to another file. What changes? (Read each one lazily, with iterators or generators, and write as you go.) This is how **external merge sort** works.
4. Real logs have clock skew between servers. How would that affect "sorted by `ts`"?
