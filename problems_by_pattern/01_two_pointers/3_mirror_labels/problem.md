# Mirror Labels

> **Pattern:** Two Pointers (opposite ends). **LeetCode:** [#125 Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) (Easy) + [#680 Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) (Easy, but the trap makes it feel Medium)

A warehouse uses **mirror labels**: codes that read the same forwards and backwards, so a scanner can read a box that's upside down. You're writing the label checker. It has two parts.

## Part 1: `isMirrorLabel(label)`

Labels are typed by people, so they contain spaces, punctuation and mixed case. Return `true` if the label is a mirror once you:

- **ignore case** (`A` and `a` are the same), and
- **ignore every character that isn't a letter or a digit** (`A–Z`, `a–z`, `0–9`).

An empty label, or one with no letters or digits, counts as a mirror.

```
"Was it a car or a cat I saw?"   -> true    (wasitacaroracatisaw)
"Order #2112-REDRO"              -> true    (order2112redro)
"race a car"                     -> false   (raceacar)
"0P"                             -> false   (digits count: "0p" is not a mirror)
```

**Target:** O(n) time, **O(1) extra space**. Building a cleaned-up copy and reversing it works and is a fine first answer. Then do it without the copy.

## Part 2: `isMirrorWithOneSlip(code)`

Codes printed by the label machine are lowercase letters only. Sometimes the printer **inserts one stray character**. Return `true` if the code is a mirror after deleting **at most one** character.

```
"abca"      -> true    (delete "b" -> "aca", or delete "c" -> "aba")
"racecar"   -> true    (no deletion needed)
"abc"       -> false   (you'd need to delete two)
"abbab"     -> true    (delete the LAST "b" -> "abba")
```

**Target:** O(n) time, O(1) extra space. Trying every possible deletion is O(n²), and the large test catches that.

<details>
<summary>Hint for Part 1</summary>

Put one pointer at each end. Before comparing, move each pointer past anything that isn't a letter or digit. Be careful those inner loops don't run past each other.

</details>

<details>
<summary>Hint for Part 2</summary>

Walk inward like Part 1. While the ends match, you have no reason to delete anything. At the **first** mismatch, one of those two characters must go, but you don't know which one. How many ways are there to continue, and what does each one need to check?

</details>

> **If `node index.js` hangs** and never finishes, your Part 1 pointers are probably running off the end of the label on the "only punctuation" test. Press `Ctrl+C` and check the inner loops.

## Follow-ups

1. In Part 1, why is it safe to compare `label[left]` and `label[right]` and then throw both away?
2. In Part 2, a "greedy" version picks one side to delete by peeking at the next character. Why can that fail? (Look at the `abbab` test.)
3. What if the printer can insert up to **k** stray characters? See [#1216 Valid Palindrome III](https://leetcode.com/problems/valid-palindrome-iii/).
4. Related: [#5 Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) uses pointers expanding **outward** from the middle instead.
