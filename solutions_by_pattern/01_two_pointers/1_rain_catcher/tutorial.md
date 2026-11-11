# Tutorial: Rain Catcher

**Problem:** [problem.md](../../../problems_by_pattern/01_two_pointers/1_rain_catcher/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#11 Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

Pick two posts to maximize `min(h[i], h[j]) * (j - i)`.

---

## Step 1: Start with the brute force

Always say the brute force out loud first. It proves you understand the problem, and it gives you something to improve on.

```js
let best = 0;
for (let i = 0; i < n; i++)
  for (let j = i + 1; j < n; j++)
    best = Math.max(best, Math.min(h[i], h[j]) * (j - i));
```

That's **O(n²)**. For 50,000 posts it's 1.25 billion pairs, and the "large input" test fails on time.

## Step 2: The key insight, which pairs can we skip?

Water depends on two things: **width** and the **shorter** post. Start with the widest possible pair, the first and last posts. From there, *any* other pair is narrower. So to do better, we need a taller "short side".

Say `h[left] < h[right]`. Consider every pair that still uses `left` but with a closer right post `j < right`:

- the width is **smaller** (`j - left < right - left`), and
- the height is still **at most `h[left]`**, because `min(h[left], anything) ≤ h[left]`.

So **none** of those pairs can beat the current one. Post `left` has nothing better to offer, and we can drop it: `left++`.

> **This is the core skill of two pointers:** at every step, explain why the element you move past can't be part of a better answer.

If `h[right]` is the shorter one, the same argument says to drop `right`. On a tie, dropping either is safe. Both are capped at the same height and every pair inside is narrower.

## Step 3: Trace the example

`heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]`

| left (h) | right (h) | width | water            | best | move                 |
| -------- | --------- | ----- | ---------------- | ---- | -------------------- |
| 0 (1)    | 8 (7)     | 8     | min(1,7)·8 = 8   | 8    | 1 < 7, so `left++`   |
| 1 (8)    | 8 (7)     | 7     | min(8,7)·7 = **49** | **49** | 8 > 7, so `right--` |
| 1 (8)    | 7 (3)     | 6     | 3·6 = 18         | 49   | `right--`            |
| 1 (8)    | 6 (8)     | 5     | 8·5 = 40         | 49   | tie, so `right--`    |
| 1 (8)    | 5 (4)     | 4     | 4·4 = 16         | 49   | `right--`            |
| 1 (8)    | 4 (5)     | 3     | 5·3 = 15         | 49   | `right--`            |
| 1 (8)    | 3 (2)     | 2     | 2·2 = 4          | 49   | `right--`            |
| 1 (8)    | 2 (6)     | 1     | 6·1 = 6          | 49   | `right--`, pointers meet |

The answer is **49**, after 8 steps instead of 36 pairs.

## Step 4: The code

See [solution.js](solution.js). It's about 10 lines:

1. `left = 0` and `right = n - 1`.
2. While `left < right`: measure, update `best`, then move the **shorter** side inward.
3. Return `best`. With fewer than 2 posts the loop never runs, so you get `0` for free.

## Complexity

- **Time O(n):** each step moves one pointer, so there are at most n − 1 steps.
- **Space O(1).**

## Pitfalls

- **Moving the taller post.** That throws away pairs that could still win.
- `left <= right`: a single post holds no water, so use `<`.
- Don't confuse this with [#42 Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/). There, *every* gap holds water and the posts in between matter.

## Follow-up answers

1. **Why is moving the shorter post safe?** Every pair it could still form is narrower and capped by its own height. That's the argument in Step 2.
2. **On a tie, does it matter which one you move?** No. Both are capped at the same height, so any better pair would need *both* posts to be replaced. Either move keeps that pair reachable.

## Say it in the interview (about 30 seconds)

> "The brute force checks all pairs, which is O(n²). Instead, I start with the widest pair and move inward. Water is limited by the shorter post, so every pair that keeps the shorter post and moves the other one closer is narrower with the same cap. It can't win, so I discard the shorter post and move inward. That's one pass: O(n) time, O(1) space."
