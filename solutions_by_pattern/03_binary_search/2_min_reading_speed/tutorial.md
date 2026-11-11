# Tutorial: Minimum Reading Speed

**Problem:** [problem.md](../../../problems_by_pattern/03_binary_search/2_min_reading_speed/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#875 Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)

Find the smallest reading speed that finishes all the books within `hours`.

---

## Step 1: The building block, checking one speed

Before anything clever, answer the easy question: *"At speed `s`, how many hours does it take?"*

Each book takes `ceil(pages / s)` hours. You can't share an hour between books, so a 7-page book at 4 pages/hour takes **2** hours, not 1.75.

```js
const hoursNeeded = (s) => books.reduce((t, p) => t + Math.ceil(p / s), 0);
```

That's O(n) per check.

## Step 2: Brute force

Try `s = 1, 2, 3, ...` and return the first one where `hoursNeeded(s) <= hours`. That's correct, but O(n × answer). With books in the millions of pages, the answer is in the millions too. The "many big books" test takes over 2 seconds this way.

## Step 3: The insight, the yes/no answer is monotonic

Reading **faster** never takes **more** hours. So if speed `s` works, every speed above `s` works too:

```
speed:        1    2    3    4    5    6    7 ...
works?        no   no   no   YES  YES  YES  YES
                             ^ we want the first YES
```

A sorted sequence of no's then yes's is exactly what binary search finds. We're not searching an array. We're searching the **space of possible answers**. This is called **"binary search on the answer"**, and it's the main lesson of this problem.

**How to recognize it:** "find the **minimum** X such that [a condition that's easy to check] holds", where a bigger X only makes it easier.

## Step 4: The bounds

- `lo = 1`: you can't read slower than 1 page per hour.
- `hi = max(books)`: at this speed every book takes 1 hour. There are at most `hours` books, so this **always works**. `hi` must be a speed you *know* works.

## Step 5: Trace the example

`books = [3, 6, 7, 11]`, `hours = 8`

| lo | hi | mid | hours needed at mid          | ≤ 8? | next      |
| -- | -- | --- | ---------------------------- | ---- | --------- |
| 1  | 11 | 6   | 1 + 1 + 2 + 2 = 6            | yes  | `hi = 6`  |
| 1  | 6  | 3   | 1 + 2 + 3 + 4 = 10           | no   | `lo = 4`  |
| 4  | 6  | 5   | 1 + 2 + 2 + 3 = 8            | yes  | `hi = 5`  |
| 4  | 5  | 4   | 1 + 2 + 2 + 3 = 8            | yes  | `hi = 4`  |
| 4  | 4  | none | done                        |      | return **4** ✓ |

## Step 6: Why `hi = mid` but `lo = mid + 1`

- `mid` **works**: it might be the answer, so keep it in range (`hi = mid`, not `mid - 1`).
- `mid` **fails**: it's definitely not the answer (`lo = mid + 1`).
- `mid` rounds **down**, so `mid < hi` whenever `lo < hi`, and `hi = mid` always shrinks the range. No infinite loop.

## Complexity

- **Time O(n · log(max pages)):** about 22 checks for books of up to 3 million pages, instead of millions.
- **Space O(1).**

## Pitfalls

- `Math.floor(pages / s)` instead of `Math.ceil`. Partial hours count as full hours.
- `hi = sum(books)` works too, but is a needlessly big range. `hi = hours` is **wrong**, because it's not a speed.
- Using `lo <= hi` with `hi = mid`, which loops forever. Choose one template and stay with it.

## Follow-up answers

1. **Why `max(books)` is a safe upper bound:** at that speed every book takes exactly 1 hour, so n hours in total, and `hours >= n` is guaranteed.
2. **#1011 / #410:** the same structure. "Can we ship within D days at capacity C?" is checked greedily and is monotonic in C.
3. **Trigger words:** "minimum/maximum value such that…", "at least / at most", a large numeric range, and a check that's easy to write for one fixed value.

## Say it in the interview

> "Checking one speed is easy: sum the ceilings, O(n). And it's monotonic: if a speed works, any faster speed works. So I binary search the speed between 1 and the biggest book, looking for the first speed that fits in the hours. That's O(n log max), instead of trying every speed."
