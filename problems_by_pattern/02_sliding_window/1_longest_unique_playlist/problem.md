# Longest Unique Playlist

> **Pattern:** Sliding Window (variable size). **LeetCode:** [#3 Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) (Medium)

A music app wants to reward listeners for variety. Given a user's listening `history`, an array of song titles in the order they were played, find the **longest stretch of consecutive plays with no song repeated**.

Write `longestUniqueStreak(history)`. It returns `{ start, length }`:

- `start` is the index where the streak begins.
- `length` is how many songs it contains.
- If several streaks tie for longest, return the **earliest**.
- For an empty history, return `{ start: 0, length: 0 }`.

Song titles are compared exactly, so `"Halo"` and `"halo"` are different songs.

## Example

```
history: ["Intro", "Dreams", "Intro", "Hurt", "Halo", "Dreams", "Halo"]
answer:  { start: 1, length: 4 }   // "Dreams", "Intro", "Hurt", "Halo"
```

## Target

O(n) time. The brute force checks every start and walks forward until it hits a repeat: O(n²).

<details>
<summary>Hint</summary>

Keep a window of plays with no repeats. When the new song is already **inside** the window, shrink from the left until it isn't. Instead of shrinking one step at a time, you can remember the **last index** where each song was seen and jump. But watch out for songs that were seen *before* the window started.

</details>

## Follow-ups

1. What does the `["a", "b", "b", "a"]` test catch? Explain it out loud.
2. Allow **at most one** repeated song in the streak. What changes?
3. [#424 Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) uses the same pattern with a harder validity rule.
