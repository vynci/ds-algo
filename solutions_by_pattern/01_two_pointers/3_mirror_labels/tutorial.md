# Tutorial: Mirror Labels

**Problem:** [problem.md](../../../problems_by_pattern/01_two_pointers/3_mirror_labels/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#125 Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) + [#680 Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/)

Part 1: is the label a palindrome, ignoring case and junk? Part 2: is the code a palindrome after deleting at most one character?

A palindrome is the purest two-pointer problem there is: character `i` from the start must equal character `i` from the end. So put one pointer at each end and walk them toward the middle.

---

# Part 1: `isMirrorLabel`

## Step 1: Start with the brute force

Clean the label, then compare it with its reverse:

```js
function isMirrorLabelWithCopy(label) {
  const cleaned = label.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === [...cleaned].reverse().join("");
}
```

This is **O(n) time**, which is already optimal, so it's a perfectly good first answer. Its cost is **O(n) extra space**: `cleaned`, the spread array and the reversed string are all new copies. The follow-up is almost always: *"Can you do it without the copies?"*

## Step 2: The key insight

Compare the outermost pair. If they match, **they are done forever**: no other character is ever compared with them. So throw both away and repeat on the inside. If they don't match, it's not a palindrome, and you can stop.

```
"racecar"
 r     r   match -> drop both
  a   a    match -> drop both
   c c     match -> drop both
    e      one character left: it mirrors itself
```

The only extra work in Part 1 is the junk. Before comparing, slide each pointer past anything that isn't a letter or digit. This is the "why is it safe to move past it?" question from the [Two Pointers README](../../../problems_by_pattern/01_two_pointers/README.md), and the answer is easy here: junk doesn't count, so skipping it can't change the answer.

## Step 3: Write the solution, piece by piece

### 3.1 Decide what counts as a "real" character

```js
const LETTER_OR_DIGIT = /^[a-z0-9]$/i;
```

- `^` and `$` mean "the whole string", and we always test a single character.
- `i` makes it case-insensitive, so `A–Z` match too.
- **No `g` flag.** A regex with `g` remembers where it stopped (`lastIndex`) between `.test()` calls. Then it gives wrong answers for the next character:

  ```js
  const re = /[a-z0-9]/gi;
  re.test("a"); // true  (and now re.lastIndex = 1)
  re.test("b"); // false! it started searching "b" at index 1
  ```

  This is a classic JavaScript bug. Using the `g` version breaks 4 of the Part 1 tests.

The regex is defined **outside** the function so it's built once, not on every call.

> If you'd rather avoid regex, you can check char codes: `(c >= 48 && c <= 57) || (c >= 97 && c <= 122)` on the lowercased character's `charCodeAt(0)`. In an interview, the regex is easier to read and to say out loud.

### 3.2 Set up the pointers

```js
function isMirrorLabel(label) {
  let left = 0;
  let right = label.length - 1;
```

For `""`, `right` is `-1`. That's fine: the loop below won't run, and we return `true`.

### 3.3 The outer loop

```js
  while (left < right) {
```

Why `<` and not `<=`? When `left === right`, both point at the **same** middle character, which always mirrors itself. There's nothing left to check.

### 3.4 Skip junk on both sides

```js
    while (left < right && !LETTER_OR_DIGIT.test(label[left])) left++;
    while (left < right && !LETTER_OR_DIGIT.test(label[right])) right--;
```

The `left < right` guard inside each inner loop is the most important detail in Part 1. Without it, a label like `".,!? "` (all junk) sends `left` past the end of the string. What happens next depends on how you check characters:

- With `charCodeAt`, `label[5]` is `undefined`, and `undefined.toLowerCase()` **throws**.
- With an anchored regex, `.test(undefined)` tests the *string* `"undefined"`, which never matches. Then `left++` runs **forever**, and your program hangs.

With the guard, the inner loops stop when the pointers meet. Then the comparison in the next step compares a character with itself, which always matches, so it's harmless.

### 3.5 Compare, ignoring case

```js
    if (label[left].toLowerCase() !== label[right].toLowerCase()) return false;
```

One mismatch is enough to stop. Lowercasing one character at a time keeps the O(1) space. Lowercasing the whole label first would make a copy.

### 3.6 Drop the matched pair and finish

```js
    left++;
    right--;
  }

  return true;
}
```

Both characters are now done, so move both pointers inward. If the loop finishes without a mismatch, every pair matched.

### 3.7 All together

```js
const LETTER_OR_DIGIT = /^[a-z0-9]$/i;

function isMirrorLabel(label) {
  let left = 0;
  let right = label.length - 1;

  while (left < right) {
    while (left < right && !LETTER_OR_DIGIT.test(label[left])) left++;
    while (left < right && !LETTER_OR_DIGIT.test(label[right])) right--;

    if (label[left].toLowerCase() !== label[right].toLowerCase()) return false;

    left++;
    right--;
  }

  return true;
}
```

## Step 4: Trace an example

`"Order #2112-REDRO"`. The indexes are:

```
O  r  d  e  r     #  2  1  1  2  -  R  E  D  R  O
0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
```

| left | right | Skipping | Compare | Result |
| --- | --- | --- | --- | --- |
| 0 | 16 | | `O` vs `O` | match |
| 1 | 15 | | `r` vs `R` | match (case ignored) |
| 2 | 14 | | `d` vs `D` | match |
| 3 | 13 | | `e` vs `E` | match |
| 4 | 12 | | `r` vs `R` | match |
| 5 → 7 | 11 → 10 | left skips the space and `#`; right skips `-` | `2` vs `2` | match |
| 8 | 9 | | `1` vs `1` | match |
| 9 | 8 | | | `left < right` is false, so stop |

The answer is **true**.

---

# Part 2: `isMirrorWithOneSlip`

## Step 1: Start with the brute force

Try deleting each character and check whether what's left is a palindrome:

```js
if (isPalindrome(code)) return true;
for (let i = 0; i < code.length; i++) {
  if (isPalindrome(code.slice(0, i) + code.slice(i + 1))) return true;
}
return false;
```

That's n deletions times an O(n) check, which is **O(n²)**. On the 100,000-letter test it took **about 8 seconds** when I ran it, so the large test fails.

## Step 2: The key insight

Walk inward exactly like Part 1. Two situations can happen at each step:

**The ends match.** Don't delete anything. You never need to delete a matching outer character, because there's always an equally good fix on the inside.

> Why? Suppose you could fix `code[left..right]` by deleting `code[left]`. Then `code[left+1..right]` is a palindrome. The inside of a palindrome is also a palindrome, so `code[left+1..right-1]` minus its first character is a palindrome too. That's a one-deletion fix for the inside, so you never needed to touch the matching ends.

**The ends don't match.** They can't both stay, because they'd face each other in the final palindrome. So **one of them is the stray**, but you can't tell which by looking. There are only two options, and you've now used your one deletion, so each option is a plain check:

- delete the left one: is `code[left+1 .. right]` a palindrome?
- delete the right one: is `code[left .. right-1]` a palindrome?

If either is `true`, the answer is `true`. You **must try both**.

### Why "just peek at the next character" fails

A tempting shortcut: on a mismatch, skip the left character if `code[left+1]` matches `code[right]`, otherwise skip the right one. Look at `"abbab"`:

```
a b b a b
^       ^    'a' vs 'b': mismatch at left = 0, right = 4
```

- The peek says `code[1]` (`b`) matches `code[4]` (`b`), so the shortcut deletes the left `a`. That leaves `"bbab"`, which is **not** a palindrome, so it answers `false`.
- But deleting the **right** `b` leaves `"abba"`, which **is** a palindrome. The correct answer is `true`.

Both options looked fine after one character. Only checking each option all the way through tells them apart. The tests `abbab` and `babba` are there to catch the shortcut whichever side it prefers.

## Step 3: Write the solution, piece by piece

### 3.1 A helper: "is this range a palindrome, with no deletions?"

```js
function isMirrorBetween(code, left, right) {
  while (left < right) {
    if (code[left] !== code[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

This is Part 1 without the junk skipping, working on a **range** of the string rather than the whole thing. Passing indexes instead of calling `code.slice(...)` avoids making a copy of the string.

### 3.2 Walk inward while the ends match

```js
function isMirrorWithOneSlip(code) {
  let left = 0;
  let right = code.length - 1;

  while (left < right) {
    if (code[left] !== code[right]) {
      // ... step 3.3
    }
    left++;
    right--;
  }

  return true;
}
```

If the loop finishes, there was never a mismatch. The code is already a palindrome and needs no deletion.

### 3.3 At the first mismatch, try both deletions

```js
    if (code[left] !== code[right]) {
      return isMirrorBetween(code, left + 1, right) || isMirrorBetween(code, left, right - 1);
    }
```

It's `return`, not "continue the loop". After this point the answer depends only on those two checks, and each one covers the whole remaining middle. The outer pairs already matched, so they don't need checking again.

### 3.4 All together

```js
function isMirrorBetween(code, left, right) {
  while (left < right) {
    if (code[left] !== code[right]) return false;
    left++;
    right--;
  }
  return true;
}

function isMirrorWithOneSlip(code) {
  let left = 0;
  let right = code.length - 1;

  while (left < right) {
    if (code[left] !== code[right]) {
      return isMirrorBetween(code, left + 1, right) || isMirrorBetween(code, left, right - 1);
    }
    left++;
    right--;
  }

  return true;
}
```

## Step 4: Trace `"abbab"`

```
a  b  b  a  b
0  1  2  3  4
```

| Step | left | right | Compare | Action |
| --- | --- | --- | --- | --- |
| 1 | 0 | 4 | `a` vs `b` | mismatch, so try both |
| 2a | 1 | 4 | **skip left:** check `b b a b` | `b`=`b`, then `b` vs `a`: **false** |
| 2b | 0 | 3 | **skip right:** check `a b b a` | `a`=`a`, `b`=`b`: **true** |

`false || true` is **true**: delete the last `b`.

And `"abc"`: `a` vs `c` mismatches. Skipping left checks `"bc"` (false), and skipping right checks `"ab"` (false). Two deletions would be needed, so the answer is **false**.

---

## Complexity

| | Time | Space |
| --- | --- | --- |
| Part 1 | **O(n)**: each pointer only moves inward, so each character is looked at about once | **O(1)** |
| Part 1, copy version | O(n) | O(n) for the cleaned and reversed copies |
| Part 2 | **O(n)**: one walk inward, then at most two scans of the remaining middle | **O(1)** |
| Part 2, brute force | O(n²) | O(n) per `slice` |

Part 2 doesn't blow up even though it "tries both", because the branching happens **once**. After the first mismatch, neither branch can delete anything else.

## Pitfalls

| Mistake | What happens | Fix |
| --- | --- | --- |
| Filtering with `[a-z]` only | `"0P"` becomes `"p"`, a false `true`. Digits count | Keep digits: `[a-z0-9]` |
| No `left < right` in the junk-skipping loops | All-junk labels run the pointer off the end: it throws or hangs | Guard both inner loops (3.4) |
| Regex with the `g` flag | `.test()` keeps state between calls, so the answers are wrong | No `g` when calling `.test()` repeatedly |
| Lowercasing the whole label first | Works, but makes an O(n) copy | Lowercase the two characters you compare |
| Part 2: trying only the left (or only the right) skip | Fails `"aab"` (or `"baa"`) | Try both |
| Part 2: peeking one character to choose a side | Fails `"abbab"` or `"babba"` | Try both, each checked all the way through |
| Part 2: deleting every character in turn | O(n²), about 8s on the large test | One walk plus two range checks |
| Part 2: a recursive "one character per call" helper | 100,000 letters is about 50,000 nested calls: `Maximum call stack size exceeded` | Loops, not recursion |
| Part 2: `code.slice(left + 1, right + 1)` for each branch | Still O(n) time, but copies the string | Pass indexes to a helper |

## Follow-up answers

1. **Why is it safe to drop a matched pair in Part 1?** A character is compared with exactly one partner, its mirror position. Once they match, nothing else will ever involve them.
2. **Why does the greedy "peek" fail in Part 2?** Both deletions can look fine for one character and only differ later. See the `abbab` trace: peeking chooses the left `a`, but only deleting the right `b` works.
3. **Up to k deletions ([#1216](https://leetcode.com/problems/valid-palindrome-iii/))?** Trying both sides at every mismatch branches up to 2ᵏ times. The standard answer is dynamic programming instead: find the **longest palindromic subsequence** (LPS) of the string. The fewest deletions needed is `n - LPS`, so the answer is `n - LPS <= k`. That's O(n²) time.
4. **Pointers moving outward ([#5](https://leetcode.com/problems/longest-palindromic-substring/))?** To find the longest palindrome *inside* a string, start both pointers at a center and expand while the ends match. Try every center, including the gaps between characters for even lengths. That's O(n²) time and O(1) space.

## Say it in the interview (about 30 seconds)

> "A palindrome means the character at each position matches its mirror, so I use two pointers from the ends and walk inward. For the label version, each pointer first skips anything that isn't a letter or digit, guarded by `left < right` so it can't run off the end, and I compare in lowercase. That's O(n) time and O(1) space.
>
> For the one-deletion version, I walk inward while the ends match, because there's never a reason to delete a matching pair. At the first mismatch one of the two characters has to go, and I can't tell which, so I check both remaining ranges as plain palindromes. The branching only happens once, so it's still O(n) time and O(1) space."
