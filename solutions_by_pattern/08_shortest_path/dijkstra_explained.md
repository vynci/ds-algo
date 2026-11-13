# Dijkstra's Algorithm, Explained

A from-scratch guide: what it solves, why it works, a full hand trace, a JavaScript implementation, the variations you'll meet in interviews, and the mistakes to avoid.

Related practice: [Alert Broadcast](1_alert_broadcast/tutorial.md) and [Least Steep Bike Route](2_least_steep_bike_route/tutorial.md).

---

## 1. What problem does it solve?

> Given a graph whose edges have **non-negative weights** (time, distance, cost), find the **cheapest path from one starting node to every other node**.

This is the **single-source shortest path** problem. Everyday examples:

- A maps app finding the fastest drive, where roads have different travel times.
- Network routing, where links have different latencies. (OSPF, a real internet routing protocol, runs Dijkstra.)
- Game AI moving across terrain that costs different amounts to cross.

The key words are **weighted** and **non-negative**. If every edge costs the same, plain BFS already solves it. If some edges are negative, Dijkstra gives wrong answers (section 7).

---

## 2. Why BFS isn't enough

BFS explores in rings of **hops**: everything 1 edge away, then 2 edges away, and so on. That finds the path with the **fewest edges**, which is only the cheapest path when every edge costs the same.

```
A --10--> C            1 hop,  10 minutes
A --2--> B --3--> C    2 hops,  5 minutes   <- actually faster
```

BFS reaches `C` first via the 1-hop edge, records 10, and never looks back. We need an algorithm that explores in rings of **total cost**, not hops.

---

## 3. The intuition: a spreading ripple

Imagine pouring water into node `A`, and the water flows along every edge at the same speed. An edge of weight 5 takes 5 seconds to cross. The water reaches each node **at exactly that node's shortest distance**, because the first trickle to arrive took the fastest route.

Dijkstra **simulates that ripple**. It doesn't tick through every second. It jumps straight to "**which unreached node does the water hit next?**", and that's always the node with the **smallest known distance** that isn't finished yet.

To pull "smallest known distance" out quickly, again and again, it uses a **min-heap** (priority queue).

---

## 4. The algorithm in plain words

Keep:

- `dist[node]`: the best distance **found so far** from the source. It starts as `0` for the source and `∞` (unknown) for everything else.
- A **min-heap** of `(distance, node)` candidates, ordered by distance.

Then:

```
1. Push (0, source).
2. While the heap isn't empty:
     a. Pop the (d, node) with the SMALLEST d.
     b. If d > dist[node], this entry is out of date, so skip it.
     c. Otherwise node is now FINAL: d is its true shortest distance.
     d. "Relax" each edge node -> next (weight w):
          if d + w < dist[next]:          (found a cheaper way to `next`)
              dist[next] = d + w
              push (d + w, next)
3. dist now holds the shortest distance to every reachable node.
```

**Relaxing an edge** just means asking: "is going through this node a cheaper way to reach the neighbour than anything I knew?" If it is, record it.

---

## 5. A full worked example

Roads (two-way), with travel minutes. Start at **A**.

```
         5
    A ------- B
    |       / |
  1 |    2 /  | 1
    |     /   |
    C ------- D ------- E
         5         3
```

Edges: A–B 5, A–C 1, C–B 2, B–D 1, C–D 5, D–E 3.

### Step-by-step trace

| step | pop       | what happens                                                                                     | dist after (A B C D E)  | heap after                |
| ---- | --------- | ------------------------------------------------------------------------------------------------ | ----------------------- | ------------------------- |
| 0    | none      | start                                                                                            | 0 ∞ ∞ ∞ ∞               | (0,A)                     |
| 1    | **(0,A)** | A is final. Relax A→B: 0+5 = **5**. Relax A→C: 0+1 = **1**                                       | 0 5 1 ∞ ∞               | (1,C) (5,B)               |
| 2    | **(1,C)** | C is final. C→A: 2, no better. C→B: 1+2 = **3** < 5, improved! C→D: 1+5 = **6**                  | 0 **3** 1 6 ∞           | (3,B) (5,B) (6,D)         |
| 3    | **(3,B)** | B is final. B→A, B→C: no better. B→D: 3+1 = **4** < 6, improved!                                 | 0 3 1 **4** ∞           | (4,D) (5,B) (6,D)         |
| 4    | **(4,D)** | D is final. D→B, D→C: no better. D→E: 4+3 = **7**                                                | 0 3 1 4 **7**           | (5,B) (6,D) (7,E)         |
| 5    | (5,B)     | **stale**: 5 > dist[B] = 3. Skip                                                                 | unchanged               | (6,D) (7,E)               |
| 6    | (6,D)     | **stale**: 6 > dist[D] = 4. Skip                                                                 | unchanged               | (7,E)                     |
| 7    | **(7,E)** | E is final. E→D: 10, no better                                                                   | **0 3 1 4 7**           | empty, done               |

**Result:** A = 0, C = 1, B = 3, D = 4, E = 7. The shortest route to E is **A → C → B → D → E** (1 + 2 + 1 + 3 = 7).

### Three things this trace shows

1. **First discovery isn't final.** B was first found at 5 (step 1), then improved to 3 (step 2). D went from 6 to 4. A node is only final **when it's popped**.
2. **The pop order is the ripple order.** The pops come out A(0), C(1), B(3), D(4), E(7): distances never go down. That's the "water reaching each node in time order" picture.
3. **Stale entries.** B and D each ended up in the heap twice. JS heaps can't lower a key in place, so we push the better entry and **skip** the outdated one when it surfaces (steps 5–6). This is called **lazy deletion**.

---

## 6. Why it's correct (the one argument to understand)

**Claim:** when a node `u` is popped with distance `d`, no path to `u` is shorter than `d`.

**Why:** suppose some path `P` to `u` were shorter. `P` starts at the source, which is finished, and ends at `u`, which isn't. So at some point `P` takes its **first step out of the finished set**, from a finished node `x` to an unfinished node `y`.

- When `x` was finished, we relaxed `x → y`, so `y` is in the heap with a distance **≤ the length of P up to y**.
- Every edge weight is **≥ 0**, so the rest of `P` (from `y` on to `u`) can't make it shorter. Therefore the length of P up to y ≤ the length of P < `d`.
- So `y` sits in the heap with a key **smaller than `d`**, and the heap would have popped `y` **before** `u`. Contradiction.

So the popped distance is final. Notice where **"weights ≥ 0"** was used: that's the one assumption everything rests on.

---

## 7. Why negative weights break it

```
A --2--> B --1--> D
|        ^
3       -2
|        |
+------> C
```

The true shortest path to B is A → C → B = 3 + (−2) = **1**, and so D = **2**.

Textbook Dijkstra pops A, then **B at distance 2**, and declares it final. Relaxing B → D gives D = 3. When C is popped later and the −2 edge is discovered, B is already final, so it's never updated, and neither is D.

| node | textbook Dijkstra | true answer |
| ---- | ----------------- | ----------- |
| B    | 2 ❌              | 1           |
| D    | 3 ❌              | 2           |

(The lazy-deletion version in section 8 doesn't keep a "finished" set. It would re-push B and fix this small case. But once nodes can be re-processed, the "each node is done once" guarantee is gone, and the worst-case run time becomes exponential. **Don't rely on it.**)

**With negative weights, use Bellman-Ford:** relax every edge V − 1 times. That's O(V · E), and it also detects **negative cycles**, where no shortest path exists at all because you could loop forever and keep getting cheaper.

---

## 8. Implementation in JavaScript

### 8a. A graph as an adjacency list

```js
// roads: [[a, b, weight], ...]  (two-way)
function buildGraph(roads) {
  const graph = new Map(); // node -> [[neighbour, weight], ...]
  const addEdge = (from, to, w) => {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push([to, w]);
  };
  for (const [a, b, w] of roads) {
    addEdge(a, b, w);
    addEdge(b, a, w); // drop this line for one-way edges
  }
  return graph;
}
```

### 8b. Dijkstra with path tracking

This uses the `MinHeap` from [`07_heap/1_kth_largest_upload`](../07_heap/1_kth_largest_upload/solution.js).

```js
function dijkstra(graph, source) {
  const dist = new Map([[source, 0]]); // best known distance
  const previous = new Map();          // how we got there (for rebuilding the path)
  const heap = new MinHeap((x, y) => x[0] - y[0]); // entries: [distance, node]
  heap.push([0, source]);

  while (heap.size > 0) {
    const [d, node] = heap.pop();
    if (d > dist.get(node)) continue; // stale entry: a shorter one was already processed

    for (const [next, w] of graph.get(node) ?? []) {
      const candidate = d + w;
      if (candidate < (dist.get(next) ?? Infinity)) {
        dist.set(next, candidate);
        previous.set(next, node);
        heap.push([candidate, next]);
      }
    }
  }

  return { dist, previous };
}
```

### 8c. Rebuilding the actual path

`previous` stores, for each node, the node we came from on its best route. Walk it backwards from the target:

```js
function pathTo(previous, source, target) {
  const path = [target];
  while (path[0] !== source) {
    const before = previous.get(path[0]);
    if (before === undefined) return null; // unreachable
    path.unshift(before);
  }
  return path;
}

// pathTo(previous, "A", "E")  ->  ["A", "C", "B", "D", "E"]
```

(This code was run on the section 5 graph, and it produces exactly that trace and this path.)

### 8d. Stopping early for a single target

If you only need **one** destination, return as soon as it's **popped**. That's safe because popped means final. Don't return when it's first *pushed*, because a cheaper route may still arrive. The bike-route solution does this.

---

## 9. Complexity

| Version | Time | When it's the right choice |
| --- | --- | --- |
| Binary heap + lazy deletion (above) | **O((V + E) log V)** | The default. Sparse graphs, which is most real ones |
| No heap: scan every node for the minimum | O(V²) | Dense graphs (E close to V²), or tiny graphs |
| Fibonacci heap | O(E + V log V) | Theoretical. Rarely worth it in practice |

Space is O(V + E): the graph, the `dist` map, and a heap of at most E entries with lazy deletion.

On the Alert Broadcast large test (20,000 nodes, 80,000 edges), the heap version takes about **30ms** and the no-heap O(V²) version about **8 seconds**.

---

## 10. Variations you'll meet

Dijkstra is really "**expand the cheapest frontier first**". It works for **any route cost that never decreases as the route gets longer**. Most interview variations change only one thing:

| Variation | What changes | Example |
| --- | --- | --- |
| **Farthest node** | Run normally, then take the `max` of `dist` | [Alert Broadcast](1_alert_broadcast/tutorial.md), #743 |
| **Grids** | Nodes are `(r, c)`, edges are the 4 neighbours, and you generate them on the fly instead of building a graph | #1631, #778 |
| **Minimax / bottleneck** | Route cost = `Math.max(cost, edge)` instead of `cost + edge` | [Least Steep Bike Route](2_least_steep_bike_route/tutorial.md), #1631 |
| **Maximize probability** | Multiply probabilities (each ≤ 1), and use a **max**-heap | #1514 |
| **Multi-source** | Push every source at distance 0 at the start | "Distance to the nearest hospital" |
| **Extra state** | A node becomes `(place, stopsUsed)` or `(place, fuel)` | #787 Cheapest Flights Within K Stops |
| **Tie-breaking** | Cost becomes a tuple `[time, hops]`, compared in order | "Fastest, then fewest transfers" |
| **A\*** | Order the heap by `dist + estimate(node → goal)` | Pathfinding on maps and in games |

**The test for "can I use Dijkstra here?"** Can extending a route ever make it *cheaper*? If no, Dijkstra works. If yes (negative edges, or a cost that can decrease), it doesn't.

---

## 11. Choosing the right shortest-path tool

| Situation | Algorithm | Time |
| --- | --- | --- |
| Every edge costs the same | **BFS** | O(V + E) |
| Edges cost only 0 or 1 | **0-1 BFS** (a deque: push-front for 0, push-back for 1) | O(V + E) |
| Non-negative weights | **Dijkstra** | O((V + E) log V) |
| Negative weights, or detecting negative cycles | **Bellman-Ford** | O(V · E) |
| Shortest paths between **all pairs** of nodes | **Floyd-Warshall** | O(V³) |
| One target, plus a good distance estimate | **A\*** | Often far less than Dijkstra |
| A DAG (no cycles), any weights | Topological order + relax | O(V + E) |

---

## 12. Common bugs

1. **Finalizing on push (the BFS habit).** In BFS a node is done when first discovered. In Dijkstra it's done when **popped**. (Section 5, steps 1–3.)
2. **Forgetting the stale check** (`if (d > dist.get(node)) continue`). It's still correct, but it re-relaxes edges for nothing, which can be very slow on big graphs.
3. **A comparator on the wrong field.** Order heap entries by **distance**, not by node name: `(x, y) => x[0] - y[0]`.
4. **One-way vs two-way.** For undirected graphs, add the edge in **both** directions.
5. **Unreachable nodes.** They never get a `dist` entry. Decide what to return (`-1`, `Infinity`, `null`) and check for it.
6. **Negative weights.** These give wrong answers with no error. Check the problem's constraints.
7. **Returning on push for a single target.** Return when the target is **popped**.
8. **`queue.shift()` or sorting an array instead of a heap.** Correct, but O(V²) or worse.

---

## 13. Interview checklist

**Recognize it:**

- "Shortest / fastest / cheapest", **and** the edges have different costs.
- "Minimum time for everything to receive / be reached."
- "Minimum effort / risk / max-step path" on a grid (minimax).

**Then say:**

1. *"It's a weighted graph with non-negative weights, so Dijkstra."* (Mention BFS if the weights were equal, and Bellman-Ford if they could be negative.)
2. *"Min-heap of (distance, node). Pop the closest, skip stale entries, relax neighbours."*
3. *"A node's distance is final when it's popped, because all weights are ≥ 0."*
4. *"O((V + E) log V) time, O(V + E) space."*
5. If they ask for the route: *"I'll track `previous` and walk it backwards."*

**JavaScript note:** there's no built-in heap. Either write the ~30-line `MinHeap` (bubble-up on push, sink-down on pop), or ask *"may I assume a priority queue with push and pop?"* Many interviewers say yes.

---

## 14. Practice ladder

1. [#743 Network Delay Time](https://leetcode.com/problems/network-delay-time/): plain Dijkstra. (This repo: [Alert Broadcast](1_alert_broadcast/tutorial.md).)
2. [#1631 Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/): grid + minimax. (This repo: [Least Steep Bike Route](2_least_steep_bike_route/tutorial.md).)
3. [#1514 Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/): multiply and maximize.
4. [#787 Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/): extra state (stops used).
5. [#778 Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/) (Hard): minimax on a grid again, which is good for checking you really understand #1631.
