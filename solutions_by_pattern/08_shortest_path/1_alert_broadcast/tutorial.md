# Tutorial: Alert Broadcast

**Problem:** [problem.md](../../../problems_by_pattern/08_shortest_path/1_alert_broadcast/problem.md). **Solution:** [solution.js](solution.js). **LeetCode:** [#743 Network Delay Time](https://leetcode.com/problems/network-delay-time/)

An alert spreads over one-way, timed relays. How long until every town has it?

---

## Step 1: Translate the story

- Towns are **nodes**, relays are **directed, weighted edges**.
- A town receives the alert at its **shortest-path distance** from `source`. Every town forwards immediately on all its relays, so the alert explores every route at once, and the fastest one wins.
- "Until **every** town has it" means the **largest** of those shortest distances.
- An unreachable town means `-1`.

So: **single-source shortest paths, then take the max.** The weights differ and are ≥ 0, so that's Dijkstra.

## Step 2: Why BFS isn't enough

BFS finds the path with the fewest **hops**. Here hops don't matter, **minutes** do:

```
A --10--> C          direct: 1 hop, 10 minutes
A --2--> B --3--> C  detour: 2 hops, 5 minutes  ✅
```

BFS reaches C first through the 1-hop edge, records 10, and never revisits it. The `cheaper route with more hops` test catches this.

## Step 3: Dijkstra in one sentence

> Always expand the **closest town that isn't final yet**. When you pop it from the min-heap, its time is final.

**Why it's final:** any other route to it must leave the "finished" area through some town that's at least as far away (otherwise *that* town would have been popped first), and then add more minutes, which are ≥ 0. So no other route can be faster.

## Step 4: Trace the "don't finalize on push" test

`A→C 5`, `A→B 1`, `B→C 1`, source `A`

| step | pop (time, town) | stale? | relax                                        | arrival after       | heap after            |
| ---- | ---------------- | ------ | -------------------------------------------- | ------------------- | --------------------- |
| 0    | none             |        | none                                         | A:0                 | (0,A)                 |
| 1    | (0, A)           | no     | C: 0+5 = 5 < ∞ ✓; B: 0+1 = 1 < ∞ ✓          | A:0, C:5, B:1       | (1,B), (5,C)          |
| 2    | (1, B)           | no     | C: 1+1 = **2** < 5 ✓ (improved!)             | A:0, B:1, C:**2**   | (2,C), (5,C)          |
| 3    | (2, C)           | no     | none                                         |                     | (5,C)                 |
| 4    | (5, C)           | **yes**, 5 > 2, skip |                                |                     | empty                 |

The latest arrival is **2** ✓

Two things to notice:

1. When C was **first discovered** (step 1) its time was 5, which was wrong. If we had "finalized on push" like BFS does, we'd answer 5. A node is only final when **popped**.
2. C ended up in the heap **twice**. JS heaps can't update a priority in place, so we push the improved entry and **skip** the stale one when it comes out (step 4). This is called **lazy deletion**.

## Step 5: The code structure

```
build adjacency list (one-way: from -> [to, minutes])
arrival = { source: 0 }, heap = [(0, source)]
while heap not empty:
  pop (time, town)
  if time > arrival[town]: skip (stale)
  for each relay town -> next:
    if time + minutes < arrival[next]: update it, push (new time, next)
if any town missing from arrival: return -1
return max(arrival)
```

## Complexity

- **Time O((V + E) log V):** each relay can cause at most one push, and each push and pop is O(log) of the heap size.
- **Space O(V + E):** the graph, the arrival map and the heap.
- **Without a heap** (scan all towns for the minimum each time): O(V²). The large test takes about 8 seconds that way instead of about 30ms.

## Pitfalls

- Finalizing on push or discovery (Step 4).
- Not skipping stale entries. It's still correct, but it re-relaxes edges for nothing.
- Making relays two-way. The `relays are one-way` test catches that.
- Parallel relays: just relax both. The faster one wins automatically.
- Forgetting the unreachable check: `arrival.size < towns.length`.

## Follow-up answers

1. **Why BFS fails:** Step 2. BFS minimizes hops, not total weight.
2. **Finalize on pop:** Step 4. The first route found isn't necessarily the fastest.
3. **The actual route:** keep `previous.set(next, town)` whenever you relax. To rebuild the path to the slowest town, walk `previous` backwards from it to `source`, then reverse.
4. **Negative delays:** the "popped means final" argument depends on weights being ≥ 0. A negative edge discovered later could make a finished town reachable sooner. Use **Bellman-Ford**: relax every edge V − 1 times, which is O(V · E). It also detects negative cycles.

## Say it in the interview

> "Each town receives the alert at its shortest-path time from the source, and the answer is the maximum of those, or -1 if any town is unreachable. The edges have different non-negative weights, so I use Dijkstra with a min-heap of (time, town). I pop the earliest town, skip it if it's a stale entry, and relax its outgoing relays. A town's time is final when it's popped. O((V + E) log V)."
