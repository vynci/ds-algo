# Tutorial: Longest Unique Playlist

**Problem:** [problem.md](../../../problems_by_pattern/02_sliding_window/1_longest_unique_playlist/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#3 Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

Find the longest **consecutive** stretch with no repeated song.

---

## Step 1: Brute force

For every start index, walk forward with a `Set` until you hit a repeat, and track the best. That's **O(n²)**, and most of the work is wasted. When you move the start forward by one, you rebuild almost the same set from scratch.

## Step 2: The sliding window idea

Keep a window `[left, right]` that is **always valid** (no repeats), and grow it one song at a time:

- **Grow:** move `right` forward and add the new song.
- **If that created a repeat:** move `left` forward until the window is valid again.
- **Measure:** `right - left + 1`.

`left` and `right` each move forward at most n times, so it's **O(n)** in total.

### Shrinking in one jump

The textbook version shrinks one step at a time with a `Set`:

```js
while (inWindow.has(song)) inWindow.delete(history[left++]);
```

That's also O(n) overall. The slicker version remembers **where each song was last played** and jumps `left` directly to `lastSeen + 1`.

## Step 3: The `Math.max` trap ("abba")

`lastSeen` remembers songs from **before** the window too. So if you blindly set `left = lastSeen.get(song) + 1`, `left` can move **backwards**:

`["a", "b", "b", "a"]`

| right | song | lastSeen before | naive `left` | correct `left = max(left, ...)` | window (correct) |
| ----- | ---- | --------------- | ------------ | ------------------------------- | ---------------- |
| 0     | a    | none            | 0            | 0                               | a                |
| 1     | b    | none            | 0            | 0                               | a b (length 2)   |
| 2     | b    | 1               | 2            | 2                               | b                |
| 3     | a    | 0               | **1** ❌     | **max(2, 1) = 2** ✓             | b a (length 2)   |

The naive version thinks `b b a` is a valid window of length 3. `Math.max` keeps `left` from going backwards.

## Step 4: Trace the example

`["Intro", "Dreams", "Intro", "Hurt", "Halo", "Dreams", "Halo"]`

| right | song   | last seen | left | window                          | length | best      |
| ----- | ------ | --------- | ---- | ------------------------------- | ------ | --------- |
| 0     | Intro  | none      | 0    | Intro                           | 1      | {0, 1}    |
| 1     | Dreams | none      | 0    | Intro Dreams                    | 2      | {0, 2}    |
| 2     | Intro  | 0         | 1    | Dreams Intro                    | 2      | {0, 2}    |
| 3     | Hurt   | none      | 1    | Dreams Intro Hurt               | 3      | {1, 3}    |
| 4     | Halo   | none      | 1    | Dreams Intro Hurt Halo          | **4**  | **{1, 4}** |
| 5     | Dreams | 1         | 2    | Intro Hurt Halo Dreams          | 4      | {1, 4} (tie keeps the earliest) |
| 6     | Halo   | 4         | 5    | Dreams Halo                     | 2      | {1, 4}    |

The answer is `{ start: 1, length: 4 }` ✓

## Complexity

- **Time O(n):** one pass, with O(1) map operations.
- **Space O(k):** k is the number of distinct songs.

## Pitfalls

- Moving `left` backwards (above).
- Using `>=` instead of `>` when updating `best`. That returns the **latest** streak on ties, not the earliest.
- Comparing titles case-insensitively. The spec says titles are compared exactly.

## Follow-up answers

1. **The abba test:** see Step 3.
2. **At most one repeat allowed:** track counts in the window, plus how many songs currently have a count ≥ 2. Shrink while that number is more than 1. It's the same template with a different validity rule.
3. **#424** uses the same template. The rule there is "window length − count of the most frequent letter ≤ k".

## Say it in the interview

> "I keep a sliding window that never contains a repeat. I extend it on the right, and when the new song is already inside it, I jump the left edge just past that song's last position, using a max so it never moves backwards. Each index enters and leaves the window once, so it's O(n) time and O(k) space for the last-seen map."
