# Solutions by Pattern

These are worked solutions and step-by-step tutorials for every problem in [`../problems_by_pattern`](../problems_by_pattern/README.md).

> **Try the problem first.** Even 20 minutes of being stuck makes the tutorial stick far better. If you're stuck, open the hint in the `problem.md` before you come here.

Each folder has:

- **`tutorial.md`**: the reasoning, in order. Brute force, then the key insight, then a traced example, then the code, then complexity, pitfalls, follow-up answers, and a 30-second "say it in the interview" script.
- **`solution.js`**: a commented solution, followed by the **same tests** as the problem. Run `node solution.js` and everything passes. Some files include alternative versions (recursive, iterative, binary search). The tutorial explains them.

## Index

| Pattern | Problem | Tutorial | Core idea in one line |
| --- | --- | --- | --- |
| Two Pointers | Rain Catcher (#11) | [tutorial](01_two_pointers/1_rain_catcher/tutorial.md) | Start wide, always move the shorter side inward |
| | Zero-Sum Trades (#15) | [tutorial](01_two_pointers/2_zero_sum_trades/tutorial.md) | Sort, fix one number, then two-pointer Two Sum. Skip duplicates in 2 places |
| Sliding Window | Longest Unique Playlist (#3) | [tutorial](02_sliding_window/1_longest_unique_playlist/tutorial.md) | Grow right; on a repeat jump left with `max`, never backwards |
| | Scrambled DNA Motif (#438) | [tutorial](02_sliding_window/2_scrambled_dna_motif/tutorial.md) | Fixed window plus a `matched` counter for O(1) anagram checks |
| Binary Search | Rotated Sensor Log (#33) | [tutorial](03_binary_search/1_rotated_sensor_log/tutorial.md) | One half is always sorted. Check whether the target is in it |
| | Minimum Reading Speed (#875) | [tutorial](03_binary_search/2_min_reading_speed/tutorial.md) | Binary search the **answer**: "is speed X enough?" is monotonic |
| BFS | Org Chart Levels (#429) | [tutorial](04_bfs/1_org_chart_levels/tutorial.md) | Snapshot the queue length, and that's one level |
| | Wildfire Spread (#994) | [tutorial](04_bfs/2_wildfire_spread/tutorial.md) | Multi-source: every fire goes in the queue at minute 0 |
| DFS | Count the Lakes (#200) | [tutorial](05_dfs/1_count_lakes/tutorial.md) | New unvisited water means a new lake. Flood-fill with an explicit stack |
| | Build Order (#210) | [tutorial](05_dfs/2_build_order/tutorial.md) | Topological sort: Kahn's in-degrees, or DFS with 3 states |
| Backtracking | Feature Flag Combos (#78) | [tutorial](06_backtracking/1_feature_flag_combos/tutorial.md) | Choose, explore, un-choose. Record at every node, push a copy |
| | Fill the Workout (#39) | [tutorial](06_backtracking/2_fill_the_workout/tutorial.md) | Recurse with `i` for reuse; sort and `break` to prune |
| Heap | Kth Largest Upload (#215) | [tutorial](07_heap/1_kth_largest_upload/tutorial.md) | Build the heap, then use a **min**-heap of size k for the k largest |
| | Merge Log Streams (#23) | [tutorial](07_heap/2_merge_log_streams/tutorial.md) | Heap of the k stream fronts. Pop one, push its successor |
| Shortest Path | Alert Broadcast (#743) | [tutorial](08_shortest_path/1_alert_broadcast/tutorial.md) | Dijkstra: pop the closest, it's final; skip stale entries |
| | Least Steep Bike Route (#1631) | [tutorial](08_shortest_path/2_least_steep_bike_route/tutorial.md) | Dijkstra with `max` instead of `+` (a minimax path) |

## How the patterns connect

```
Two Pointers --(same direction)--> Sliding Window

Binary Search --(on the answer)--> "is X enough?" checks (they reappear in the bike route)

DFS --(over decisions instead of a graph)--> Backtracking
 |
 +--(explicit stack)  vs  BFS (queue) --(weighted edges + a heap)--> Dijkstra
                                                         ^
Heap ----------------------------------------------------+
```

## Habits worth copying from every tutorial

1. **Say the brute force first**, with its complexity. Then improve it.
2. **Name the invariant**: what's always true about your window, pointers, queue or heap.
3. **Trace a small example by hand** before running anything.
4. **Know your traps**: mutating input, `shift()` costs, recursion depth, copying `path`, stale heap entries.
5. **End with the 30-second explanation.** Interviewers grade the explanation as much as the code.
