# Tutorial: Merge Log Streams

**Problem:** [problem.md](../../../problems_by_pattern/07_heap/2_merge_log_streams/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#23 Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

Merge k timestamp-sorted logs into one timeline.

---

## Step 1: The baseline

```js
streams.flat().sort((a, b) => a.ts - b.ts);
```

That's O(N log N), where N = the total number of entries. Because JS `sort` is **stable**, and `flat()` keeps stream order, this even gets the tie rule right. **Say it first.** It's correct and it passes the tests. But it ignores the most useful fact we're given: **each stream is already sorted**.

## Step 2: Remember merging two sorted lists

The merge step of merge sort compares the **fronts** of two lists, takes the smaller one, and advances that list. That's O(n). For **k** lists, the same idea applies: the next entry overall is always one of the **k current fronts**.

Comparing all k fronts every time costs O(k) per entry, so O(N · k) in total. The better question is: *what data structure gives us the minimum of k items quickly, while the items keep changing?* A **min-heap**: O(log k) per pop and push.

## Step 3: The algorithm

1. Push the **first** entry of every non-empty stream into the heap. (That's at most k items.)
2. Pop the smallest, and append it to the output.
3. Push the **next** entry **from the same stream** (if it has one).
4. Repeat until the heap is empty.

The heap always holds **at most one entry per stream**: the current front of each.

### What goes in the heap?

Not just the entry. We also need to know **which stream** it came from (to fetch its successor, and for the tie-break) and **its position** in that stream. So we store a small cursor, `{ stream, index }`, and the comparator looks up the timestamp:

```js
(a, b) => tsOf(a) - tsOf(b) || a.stream - b.stream   // the || gives the tie-break
```

### Don't use `shift()`

The tempting way to advance a stream is `streams[s].shift()`. But that **mutates the caller's input** (the `does not modify the input streams` test catches it), and `shift()` is O(n) anyway. A cursor index only reads.

## Step 4: Trace the example

```
s0: [1 api:start, 4 api:request, 9 api:stop]
s1: [2 db:start,  4 db:query]
s2: [3 web:start]
```

| step | heap (ts / stream)        | pop       | output                | push next from that stream |
| ---- | ------------------------- | --------- | --------------------- | -------------------------- |
| init | 1/s0, 2/s1, 3/s2          | none      | none                  | none                       |
| 1    | 1/s0, 2/s1, 3/s2          | **1/s0**  | api:start             | 4/s0                       |
| 2    | 2/s1, 3/s2, 4/s0          | **2/s1**  | db:start              | 4/s1                       |
| 3    | 3/s2, 4/s0, 4/s1          | **3/s2**  | web:start             | (s2 is empty)              |
| 4    | 4/s0, 4/s1                | **4/s0** (tie: s0 < s1) | api:request | 9/s0              |
| 5    | 4/s1, 9/s0                | **4/s1**  | db:query              | (s1 is empty)              |
| 6    | 9/s0                      | **9/s0**  | api:stop              | (s0 is empty)              |

The output is `api:start, db:start, web:start, api:request, db:query, api:stop` ✓

**Same-stream ties:** two entries from the same stream with the same `ts` can never be in the heap together, because only one cursor per stream exists at a time. So their original order is preserved automatically.

## Complexity

- **Time O(N log k):** each of the N entries is pushed and popped once, on a heap of size ≤ k.
- **Space O(k)** for the heap, plus the output.

When k is small compared with N (say 10 servers and 10 million lines), log k ≈ 3 vs log N ≈ 23. That's a real difference.

## Pitfalls

- Mutating the input with `shift()`.
- Forgetting the tie-break. The `ties` test catches it.
- Pushing empty streams into the heap, which crashes when reading `[0].ts`.
- Comparing only `ts` in the heap and relying on heap order for ties. **Heaps aren't stable**, so you must break ties explicitly.

## Follow-up answers

1. **Why size ≤ k:** we only ever hold the current front of each stream. Each pop is followed by at most one push from the same stream.
2. **Pairwise / divide and conquer:** merge pairs of streams with the two-list merge (1+2, 3+4, …), then repeat. There are log k rounds, each O(N), so **O(N log k)** as well, with no heap needed. It's a nice alternative to mention.
3. **Huge files:** replace the arrays with **iterators** that read lines lazily (Node `readline`, or async generators), and write output as you pop. Memory stays O(k) no matter how big the files are. This is **external merge sort**, the way databases sort data bigger than RAM.
4. **Clock skew:** server clocks disagree by milliseconds or more, so "sorted by ts" across servers is only approximate. Real systems use synchronized clocks (NTP), logical clocks (Lamport / vector clocks), or a request ID to correlate entries instead of trusting timestamps.

## Say it in the interview

> "The baseline is flatten and sort, O(N log N). But each stream is already sorted, so the next entry overall is always one of the k fronts. I keep those fronts in a min-heap keyed by timestamp then stream index, pop the smallest, and push the next entry from the same stream using an index cursor, so I don't mutate the input. That's O(N log k) time and O(k) extra space, and it also works on streams too big for memory."
