# Minimum Reading Speed

> **Pattern:** Binary Search on the **answer**. **LeetCode:** [#875 Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) (Medium)

A student has a stack of books to finish before an exam. `books[i]` is the number of pages in book `i`, and they have `hours` hours left.

They read at a fixed **speed** of `speed` pages per hour, with this rule: **each hour, they pick one book and read up to `speed` pages of it**. If the book has fewer pages left than that, they finish it and **rest for the remainder of that hour**. They never switch books mid-hour.

Write `minReadingSpeed(books, hours)`. It returns the **smallest whole-number speed** that lets them finish every book within `hours` hours.

- `hours >= books.length`, so an answer always exists.
- Every book has at least 1 page.

## Example

```
books: [3, 6, 7, 11], hours: 8
answer: 4
// At speed 4: ceil(3/4) + ceil(6/4) + ceil(7/4) + ceil(11/4) = 1 + 2 + 2 + 3 = 8 hours. ✓
// At speed 3: 1 + 2 + 3 + 4 = 10 hours. ✗
```

## Target

O(n · log(max pages)). Trying speed 1, 2, 3 and so on is O(n · max pages). With books of 10⁹ pages, that never finishes.

<details>
<summary>Hint</summary>

Write `hoursNeeded(speed)` first. If speed `s` is fast enough, is `s + 1` also fast enough? That property makes the yes/no answer **monotonic**, so you can binary search over speeds. What are the smallest and largest speeds worth trying?

</details>

## Follow-ups

1. Why is `max(books)` a safe upper bound?
2. Same pattern, different story: [#1011 Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) and [#410 Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) (Hard).
3. Recognizing "binary search on the answer" is the hard part of this problem. What words in the problem statement should trigger it?
