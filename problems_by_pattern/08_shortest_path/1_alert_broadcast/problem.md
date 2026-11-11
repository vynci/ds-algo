# Alert Broadcast

> **Pattern:** Dijkstra (single source, then the farthest node). **LeetCode:** [#743 Network Delay Time](https://leetcode.com/problems/network-delay-time/) (Medium)

A region's emergency service sends alerts through a network of **one-way radio relays** between towns. A relay `[from, to, minutes]` means a message at `from` reaches `to` after `minutes` minutes. As soon as a town receives the alert, it immediately forwards it on **all** of its outgoing relays.

Write `broadcastTime(towns, relays, source)`. The alert starts at `source` at minute 0. Return the number of minutes until **every town** has received it.

- `towns` is an array of unique town names.
- `relays` is an array of `[from, to, minutes]`, where `minutes` is a non-negative integer. Relays are **one-way**.
- There may be several relays between the same two towns. Use the fastest.
- If some town can **never** receive the alert, return `-1`.

## Example

```
       1         1
  A <----- B -----> C -----> D
                        1
```

```js
broadcastTime(
  ["A", "B", "C", "D"],
  [["B", "A", 1], ["B", "C", 1], ["C", "D", 1]],
  "B",
); // 2   (A at minute 1, C at minute 1, D at minute 2)
```

## Target

O((V + E) log V) using a min-heap. Paste your `MinHeap` from `07_heap`.

<details>
<summary>Hint</summary>

"Time until **every** town has it" is the shortest arrival time to the **slowest-to-reach** town. So find the shortest time from `source` to *every* town with Dijkstra, then take the maximum. If any town has no distance, return -1.

</details>

## Follow-ups

1. The `"cheaper route with more hops"` test: why does plain BFS get it wrong?
2. The `"don't finalize on push"` test: why can't you mark a town done the moment you first discover it?
3. Return the **actual route** the alert took to the slowest town. (Keep a `previous` map and walk it backwards.)
4. What if relays could have **negative** delays? (They can't physically, but suppose they're "credits".) Why does Dijkstra break, and what would you use instead?
