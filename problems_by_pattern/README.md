# Problems by Pattern

There are two problems per pattern. Each one is a common LeetCode interview problem with a new story around it, and links to the original so you can also submit it there.

Each **pattern folder** has a `README.md` covering the concept: when to recognize it, a JS template, complexity, and common bugs. **Read that first.**

Each **problem folder** has:

- `problem.md`: the spec, examples, target complexity, a hint folded away, and follow-up questions.
- `index.js`: an empty function plus tests. Run `node index.js` inside the folder. Every test prints `PASS` or `FAIL`.

Some tests are deliberate **traps**. Each catches a common mistake, and its name says which one: a slow brute force, a recursion depth overflow, moving a window backwards, `push(path)` without copying, and so on. A failing trap means there's something to learn there.

## The set

| Pattern | Problem | LeetCode | Level |
| --- | --- | --- | --- |
| [Two Pointers](01_two_pointers/README.md) | [Rain Catcher](01_two_pointers/1_rain_catcher/problem.md) | [#11 Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Medium |
| | [Zero-Sum Trades](01_two_pointers/2_zero_sum_trades/problem.md) | [#15 3Sum](https://leetcode.com/problems/3sum/) | Medium |
| [Sliding Window](02_sliding_window/README.md) | [Longest Unique Playlist](02_sliding_window/1_longest_unique_playlist/problem.md) | [#3 Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium |
| | [Scrambled DNA Motif](02_sliding_window/2_scrambled_dna_motif/problem.md) | [#438 Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | Medium |
| [Binary Search](03_binary_search/README.md) | [Rotated Sensor Log](03_binary_search/1_rotated_sensor_log/problem.md) | [#33 Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium |
| | [Minimum Reading Speed](03_binary_search/2_min_reading_speed/problem.md) | [#875 Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Medium |
| [BFS](04_bfs/README.md) | [Org Chart Levels](04_bfs/1_org_chart_levels/problem.md) | [#429 N-ary Tree Level Order](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) / [#102](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Medium |
| | [Wildfire Spread](04_bfs/2_wildfire_spread/problem.md) | [#994 Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | Medium |
| [DFS](05_dfs/README.md) | [Count the Lakes](05_dfs/1_count_lakes/problem.md) | [#200 Number of Islands](https://leetcode.com/problems/number-of-islands/) + [#695](https://leetcode.com/problems/max-area-of-island/) | Medium |
| | [Build Order](05_dfs/2_build_order/problem.md) | [#210 Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | Medium |
| [Backtracking](06_backtracking/README.md) | [Feature Flag Combos](06_backtracking/1_feature_flag_combos/problem.md) | [#78 Subsets](https://leetcode.com/problems/subsets/) | Medium |
| | [Fill the Workout](06_backtracking/2_fill_the_workout/problem.md) | [#39 Combination Sum](https://leetcode.com/problems/combination-sum/) | Medium |
| [Heap](07_heap/README.md) | [Kth Largest Upload](07_heap/1_kth_largest_upload/problem.md) | [#215 Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/) + build a `MinHeap` | Medium |
| | [Merge Log Streams](07_heap/2_merge_log_streams/problem.md) | [#23 Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard |
| [Shortest Path (Dijkstra)](08_shortest_path/README.md) | [Alert Broadcast](08_shortest_path/1_alert_broadcast/problem.md) | [#743 Network Delay Time](https://leetcode.com/problems/network-delay-time/) | Medium |
| | [Least Steep Bike Route](08_shortest_path/2_least_steep_bike_route/problem.md) | [#1631 Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) | Medium |

## Suggested order

1. **Two Pointers, then Sliding Window.** Sliding window is two pointers moving the same way.
2. **Binary Search.** It stands alone. Problem 2 (search the *answer*) is the one people miss.
3. **DFS, then BFS, then Backtracking.** They're all graph or tree traversal, and backtracking is DFS over choices.
4. **Heap.** You build the data structure in problem 1 and reuse it in problem 2.
5. **Shortest Path last.** Dijkstra is BFS (pattern 4) with a heap (pattern 7). Reuse your `MinHeap`.

**Solutions and tutorials** are in [`../solutions_by_pattern`](../solutions_by_pattern/README.md). Try each problem first.

## How these were picked

Every one is a staple of the widely shared interview prep lists, such as Blind 75, NeetCode 150 and LeetCode's Top Interview 150, or a close sibling of one. I chose them from general knowledge of those lists. I didn't run a fresh search of LeetCode's frequency data, which is behind LeetCode Premium. Each pattern README lists a few **more** problems to try once you're comfortable.
