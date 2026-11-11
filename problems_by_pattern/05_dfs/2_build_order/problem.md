# Build Order

> **Pattern:** DFS on a directed graph (cycle detection + topological sort). **LeetCode:** [#210 Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) (Medium). [#207 Course Schedule](https://leetcode.com/problems/course-schedule/) is the yes/no version.

A monorepo has several packages, and some depend on others. A package can only be built **after everything it depends on** has been built.

Write `buildOrder(packages, deps)`:

- `packages` is an array of unique package names.
- `deps` is an array of pairs `[pkg, dependsOn]`, meaning *`dependsOn` must be built before `pkg`*.
- Return an array with **every package exactly once**, in an order where each package comes after all of its dependencies.
- If that's impossible because of a **circular dependency**, return `null`.

There can be **many valid orders**. Any of them passes, because the tests check that your order is valid, not that it matches one specific answer.

## Example

```js
buildOrder(
  ["app", "ui", "api", "db", "utils"],
  [["app", "ui"], ["app", "api"], ["api", "db"], ["ui", "utils"], ["api", "utils"]],
);
// One valid answer: ["db", "utils", "api", "ui", "app"]
// Also valid:       ["utils", "ui", "db", "api", "app"]

buildOrder(["a", "b", "c"], [["a", "b"], ["b", "c"], ["c", "a"]]);
// null   (a -> b -> c -> a)
```

## Target

O(P + D), where P = the number of packages and D = the number of dependency pairs.

<details>
<summary>Hint (DFS)</summary>

Build an adjacency list: `pkg -> [what it depends on]`. To "build" a package, first DFS into each of its dependencies, then add the package itself to the output. That's a **post-order** traversal. To detect cycles, give each package one of three states: unvisited, **in progress**, or done. Seeing an *in-progress* package again means you've gone round in a loop.

</details>

<details>
<summary>Hint (the BFS alternative: Kahn's algorithm)</summary>

Count how many unbuilt dependencies each package has (its **in-degree**). Start with every package that has zero. Each time you build one, decrement the packages that were waiting on it. If you finish with packages left over, there's a cycle.

</details>

## Follow-ups

1. Explain the "diamond" test. Why does a plain `visited` set wrongly report a cycle there?
2. Return the **cycle itself** (for example `["a", "b", "c", "a"]`) so the error message is useful.
3. Which packages could be built **in parallel**? Group them into "waves". (Kahn's algorithm, level by level.)
4. A dependency names a package that isn't in `packages`. What should happen? What would you ask the interviewer?
5. The last test is a chain 20,000 packages deep. A recursive DFS overflows the call stack there. Get the recursive version passing everything else first, then fix it with Kahn's algorithm or an explicit stack. Real dependency graphs are rarely that deep, so in an interview it's enough to **say** this.
