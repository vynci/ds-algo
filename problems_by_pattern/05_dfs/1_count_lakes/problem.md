# Count the Lakes

> **Pattern:** DFS flood fill on a grid. **LeetCode:** [#200 Number of Islands](https://leetcode.com/problems/number-of-islands/) + [#695 Max Area of Island](https://leetcode.com/problems/max-area-of-island/) (Medium)

A drone has surveyed a region and produced a map as an array of strings:

| Char | Meaning |
| ---- | ------- |
| `~`  | Water   |
| `#`  | Land    |

Water cells that touch **up, down, left or right** belong to the same lake. Diagonal neighbours do **not** connect.

Write `surveyLakes(map)`. It returns `{ count, largest }`:

- `count` is the number of separate lakes.
- `largest` is the size, in cells, of the biggest lake.
- With no water, return `{ count: 0, largest: 0 }`.
- Don't change the input. (It's an array of strings, which you can't change in place anyway.)

## Example

```
~ ~ #
~ # #      ->  { count: 2, largest: 3 }
# ~ ~

Lake 1: the 3 cells in the top-left. Lake 2: the 2 cells in the bottom-right.
```

## Target

O(rows × cols) time. Each cell is visited a constant number of times.

<details>
<summary>Hint</summary>

Scan every cell. When you find water you haven't visited, that's a **new lake**: increase the count, then flood-fill everything connected to it, marking cells visited and counting them. The last test has one lake of 90,000 cells, so think about what a recursive flood fill does there.

</details>

## Follow-ups

1. Recursive or iterative? Which did you choose, and what's the risk of each?
2. Could you use BFS instead? Would the answer change?
3. Count only lakes that **don't touch the map's edge**, the "closed" lakes ([#1254](https://leetcode.com/problems/number-of-closed-islands/)).
4. The map is too big to fit in memory and arrives one row at a time. (Union-Find, [#305](https://leetcode.com/problems/number-of-islands-ii/).)
