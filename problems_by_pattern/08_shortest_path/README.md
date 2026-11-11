# Shortest Path: Dijkstra's Algorithm

## The idea

BFS finds the shortest path when every step costs the same. Real maps aren't like that. A road can take 2 minutes or 40, and a cable can have 5ms or 300ms of latency. **Dijkstra's algorithm** handles **weighted** edges, as long as no weight is **negative**.

It's BFS with one change. Instead of a plain queue (first in, first out), it uses a **priority queue (min-heap)** that always hands you the **closest node you haven't finished yet**.

```
Repeat:
  1. Pop the node with the smallest known distance.
  2. That distance is now FINAL. Nothing later can beat it.
  3. "Relax" its edges: for each neighbour, if going through this node is
     shorter than what we knew, record the new distance and push it.
```

### Why "smallest is final" works

Every other route to that node would have to pass through some node that's **at least as far away**, and then add a weight that's **≥ 0**. So it can't be shorter. This is exactly where **negative weights break it**: a negative edge later on *could* make a longer-looking route shorter.

## When to recognize it

- "Shortest / fastest / cheapest route", "minimum total cost / time / latency" **with different costs per edge**.
- "How long until everyone receives the signal?" (shortest distance to the *farthest* node).
- Grids where moving between cells has a **cost** that varies: terrain, effort, height difference.

| Situation                         | Use                                     |
| --------------------------------- | --------------------------------------- |
| Every edge costs the same         | **BFS** (`04_bfs`). It's simpler and O(V + E) |
| Edges cost 0 or 1 only            | 0-1 BFS (a deque)                       |
| Non-negative weights              | **Dijkstra**                            |
| Negative weights                  | Bellman-Ford                            |
| A good "distance to goal" estimate | A\* (Dijkstra + a heuristic)           |

## Template

```js
function dijkstra(graph, source) {
  // graph: Map<node, Array<[neighbour, weight]>>
  const dist = new Map([[source, 0]]);
  const heap = new MinHeap((a, b) => a[0] - b[0]); // entries: [distance, node]
  heap.push([0, source]);

  while (heap.size > 0) {
    const [d, node] = heap.pop();
    if (d > dist.get(node)) continue;          // stale entry: we already found better

    for (const [next, w] of graph.get(node) ?? []) {
      const candidate = d + w;
      if (candidate < (dist.get(next) ?? Infinity)) {
        dist.set(next, candidate);              // found a shorter way to `next`
        heap.push([candidate, next]);           // (an older, worse entry may still be in the heap)
      }
    }
  }
  return dist; // shortest distance from source to every reachable node
}
```

**"Lazy deletion":** JS heaps can't update an item's priority in place. So you push a **new** entry when you find a shorter distance, and **skip** old ones when they come out (`d > dist.get(node)`). The heap can hold some duplicates, but that's fine.

## Complexity

- O((V + E) log V) with a binary heap.
- Without a heap ("scan every node for the smallest"): O(V²). That's fine for small dense graphs and painful for big sparse ones.

## Common bugs

- **Finalizing a node when you *push* it** (the BFS habit). In Dijkstra a node is final only when it's **popped**. The first route you discover isn't necessarily the cheapest.
- Not skipping stale heap entries. It's still correct, but it does a lot of wasted work.
- Undirected graphs: add **both** directions of each edge.
- Using Dijkstra with negative weights: wrong answers, silently.
- The comparator must compare **distances**, not node names.

## Problems

| #   | Problem                                                   | LeetCode                                                                            | Level  |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------ |
| 1   | [Alert Broadcast](1_alert_broadcast/problem.md)           | [#743 Network Delay Time](https://leetcode.com/problems/network-delay-time/)        | Medium |
| 2   | [Least Steep Bike Route](2_least_steep_bike_route/problem.md) | [#1631 Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) | Medium |

Both need a heap. Paste your `MinHeap` from `07_heap/1_kth_largest_upload`.

**More:** [#787 Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) (a twist: limited stops), [#1514 Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/), [#778 Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/) (Hard).
