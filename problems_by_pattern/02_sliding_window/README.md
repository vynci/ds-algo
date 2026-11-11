# Sliding Window

## The idea

Look at a **contiguous** stretch of an array or string, the window `[left, right]`, and slide it along. You don't recompute everything for every window. You **update** the state as one element enters on the right and another leaves on the left. Each element enters once and leaves once, so the total cost is O(n) instead of O(n²) or O(n·k).

It's a special case of two pointers where both move in the **same direction**, and what you care about is everything *between* them.

| Shape         | Window size                                        | Example                                              |
| ------------- | -------------------------------------------------- | ---------------------------------------------------- |
| **Fixed**     | Always `k`. Add one on the right, drop one on the left | "Max sum of any 5 consecutive days", anagram windows |
| **Variable**  | Grows until it becomes invalid, then shrinks until valid again | "Longest stretch with no repeats", "shortest stretch with sum ≥ X" |

## When to recognize it

- The words **substring**, **subarray**, **consecutive** or **contiguous**.
- "Longest", "shortest", or "number of windows that…".
- A validity rule you can update incrementally: counts, sums, a set of what's inside.

If the problem says **subsequence** (it can skip elements), it's *not* sliding window.

## Template: variable window

```js
let left = 0;
let best = 0;
const state = new Map(); // what's currently inside the window

for (let right = 0; right < arr.length; right++) {
  add(state, arr[right]);                 // 1. grow: take in the new element

  while (windowIsInvalid(state)) {        // 2. shrink until valid again
    remove(state, arr[left]);
    left++;
  }

  best = Math.max(best, right - left + 1); // 3. the window is valid, so record it
}
```

## Template: fixed window of size k

```js
for (let right = 0; right < arr.length; right++) {
  add(state, arr[right]);
  if (right >= k) remove(state, arr[right - k]); // drop the one that fell out
  if (right >= k - 1) check(state, right - k + 1); // a full window starts here
}
```

## Complexity

- Usually O(n) time: `left` only ever moves forward, so the inner `while` adds at most n steps **in total**, not per iteration.
- Space: O(size of the alphabet or the number of distinct values) for the state.

## Common bugs

- **Moving `left` backwards.** If you jump `left` to "the last seen position + 1", use `Math.max(left, ...)`. The input `"abba"` is the classic trap.
- Off-by-one on the window length: it's `right - left + 1`.
- In fixed windows, comparing two `Map`s on every step costs O(alphabet). That's fine for 4 DNA letters or 26 letters. Mention it.
- Not deleting keys whose count drops to 0, which breaks any `map.size` checks.

## Problems

| #   | Problem                                                       | LeetCode                                                                                                          | Level  |
| --- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | [Longest Unique Playlist](1_longest_unique_playlist/problem.md) | [#3 Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium |
| 2   | [Scrambled DNA Motif](2_scrambled_dna_motif/problem.md)       | [#438 Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)                | Medium |

**More practice:** [#209 Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/), [#424 Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/), [#76 Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) (Hard, the boss fight).
