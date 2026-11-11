# Wildfire Spread

> **Pattern:** Multi-source BFS on a grid. **LeetCode:** [#994 Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) (Medium)

A forest is mapped as a grid of strings. Each character is one cell:

| Char | Meaning                                  |
| ---- | ---------------------------------------- |
| `T`  | A healthy tree                           |
| `F`  | A tree that is on fire                   |
| `.`  | Bare ground or a firebreak (can't burn)  |

Every minute, fire spreads from **every** burning tree to each healthy tree directly **up, down, left or right** of it. Diagonals don't count.

Write `minutesToBurn(forest)`. It returns the number of minutes until **no healthy trees are left**.

- If some trees can **never** catch fire, return `-1`.
- If there are no healthy trees at the start, return `0`.

## Example

```
minute 0     minute 1     minute 2     minute 3     minute 4
F T T        F F T        F F F        F F F        F F F
T T .        F T .        F F .        F F .        F F .
. T T        . T T        . T T        . F T        . F F
```

```js
minutesToBurn(["FTT", "TT.", ".TT"]) // 4
```

## Target

O(rows × cols).

<details>
<summary>Hint</summary>

Don't run a separate search from each fire. Put **all** the starting fires in the queue at once, then process the queue one level (one minute) at a time. Count the healthy trees at the start and decrement as they catch fire. That tells you at the end whether any were left untouched.

</details>

## Follow-ups

1. Why does running BFS from one fire at a time give the **wrong** answer? (Look at the `"FTTTF"` test.)
2. Each cell is a string character, and strings are immutable. How do you track what's burning: a copy of the grid, or a `Set` of `"r,c"` keys?
3. Real fires spread diagonally too. What changes for 8 directions?
4. Related: [#286 Walls and Gates](https://leetcode.com/problems/walls-and-gates/) and [#542 01 Matrix](https://leetcode.com/problems/01-matrix/) are multi-source BFS too.
