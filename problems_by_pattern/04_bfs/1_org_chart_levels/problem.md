# Org Chart Levels

> **Pattern:** BFS, level order. **LeetCode:** [#429 N-ary Tree Level Order Traversal](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) (Medium). It's the same idea as the more famous [#102 Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/).

HR wants to print the company's org chart **one management level per line**. Each person is an object:

```js
{ name: "Ana", reports: [ /* people who report directly to Ana */ ] }
```

Write `levelsOf(root)`. It returns an array of levels, where each level is an array of names.

- Level 0 is just the root, level 1 is the root's direct reports, and so on.
- Within a level, list people **left to right**: in the order of their manager's position, then the order of their manager's `reports` array.
- If `root` is `null`, return `[]`.

## Example

```
          Ana
        /     \
      Ben      Cara
     /   \        \
   Dev   Eli      Fay
    |
   Gus
```

```js
levelsOf(ana)
// [["Ana"], ["Ben", "Cara"], ["Dev", "Eli", "Fay"], ["Gus"]]
```

## Target

O(n) time and space, where n is the number of people.

<details>
<summary>Hint</summary>

Use a queue. At the start of each level, the queue holds **exactly** the people on that level. How do you know where one level stops and the next begins?

</details>

## Follow-ups

1. One test is a chain 20,000 people deep. If you solved it recursively (DFS with a `depth` parameter), what happens, and why does BFS not care?
2. **Zigzag:** alternate left-to-right and right-to-left by level ([#103](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)).
3. Return only the **widest level** (most people), or the **last person** on each level ([#199 Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)).
