# Scrambled DNA Motif

> **Pattern:** Sliding Window (fixed size) + frequency counts. **LeetCode:** [#438 Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) (Medium)

A biology lab is looking for a short **motif** inside a long **genome**. Both are strings made of the letters `A`, `C`, `G` and `T`. The motif may appear **scrambled**: any rearrangement of its letters counts as a match. For example, the motif `CAG` matches `ACG`, `GCA` and `CAG`.

Write `findScrambledMotif(genome, motif)`. It returns the **start index of every match**, in ascending order. A match is a substring of `genome` with the same length as `motif` and exactly the same letter counts.

- Matches can **overlap**.
- If `motif` is longer than `genome`, return `[]`.
- `motif` is never empty.

## Example

```
genome: "ACGTCAGT"
motif:  "CAG"
answer: [0, 4]    // "ACG" at 0, "CAG" at 4
```

## Target

O(n) time, where n = `genome.length`. Treat the 4-letter alphabet as a constant. The brute force sorts or counts every window from scratch: O(n · m).

<details>
<summary>Hint</summary>

Every candidate has the same length as the motif, so this is a **fixed-size** window. Count the motif's letters once. Then slide a window of that size across the genome: add the letter coming in and remove the letter going out. How do you check "same counts as the motif" cheaply at each step?

</details>

## Follow-ups

1. Instead of comparing all 4 counts at every step, track **how many letters currently match**. Then each step is O(1) whatever the alphabet size. How?
2. Return only `true`/`false` for "does any match exist": [#567 Permutation in String](https://leetcode.com/problems/permutation-in-string/).
3. What changes for a general alphabet, such as Unicode text?
