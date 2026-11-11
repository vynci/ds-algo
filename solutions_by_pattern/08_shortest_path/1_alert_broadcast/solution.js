// Run: node solution.js
// Alert Broadcast (LeetCode #743 Network Delay Time). See tutorial.md.

// The same MinHeap as in 07_heap.
class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.compare = compare;
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  peek() {
    return this.items[0];
  }
  push(value) {
    const items = this.items;
    items.push(value);
    let i = items.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(items[i], items[parent]) >= 0) break;
      [items[i], items[parent]] = [items[parent], items[i]];
      i = parent;
    }
  }
  pop() {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let best = i;
        if (l < items.length && this.compare(items[l], items[best]) < 0) best = l;
        if (r < items.length && this.compare(items[r], items[best]) < 0) best = r;
        if (best === i) break;
        [items[i], items[best]] = [items[best], items[i]];
        i = best;
      }
    }
    return top;
  }
}

function broadcastTime(towns, relays, source) {
  // 1. Adjacency list: town -> [[neighbour, minutes], ...]. Relays are one-way.
  const graph = new Map(towns.map((t) => [t, []]));
  for (const [from, to, minutes] of relays) graph.get(from).push([to, minutes]);

  // 2. Dijkstra. arrival[town] = the best known arrival time so far.
  const arrival = new Map([[source, 0]]);
  const heap = new MinHeap((a, b) => a[0] - b[0]); // entries: [time, town]
  heap.push([0, source]);

  while (heap.size > 0) {
    const [time, town] = heap.pop();

    // Lazy deletion: this entry is outdated, because a faster route was already found and processed.
    if (time > arrival.get(town)) continue;

    // `town` is now FINAL: nothing still in the heap is earlier, and weights are >= 0.
    for (const [next, minutes] of graph.get(town)) {
      const candidate = time + minutes;
      if (candidate < (arrival.get(next) ?? Infinity)) {
        arrival.set(next, candidate); // "relax" the edge
        heap.push([candidate, next]);
      }
    }
  }

  // 3. Every town must be reached. The answer is the LATEST arrival.
  if (arrival.size < towns.length) return -1;
  let latest = 0;
  for (const t of arrival.values()) latest = Math.max(latest, t);
  return latest;
}

// ---- tests (identical to the problem's index.js) ----

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) console.log(`      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`);
}

function run(name, fn) {
  try {
    fn();
  } catch (err) {
    console.log(`FAIL  ${name} (threw: ${err.message})`);
  }
}

const cases = [
  ["example", ["A", "B", "C", "D"], [["B", "A", 1], ["B", "C", 1], ["C", "D", 1]], "B", 2],
  ["single relay", ["A", "B"], [["A", "B", 1]], "A", 1],
  ["relays are one-way", ["A", "B"], [["A", "B", 1]], "B", -1],
  ["single town", ["Solo"], [], "Solo", 0],
  ["cheaper route with more hops", ["A", "B", "C"], [["A", "C", 10], ["A", "B", 2], ["B", "C", 3]], "A", 5],
  ["don't finalize on push", ["A", "B", "C"], [["A", "C", 5], ["A", "B", 1], ["B", "C", 1]], "A", 2],
  ["parallel relays: use the fastest", ["A", "B"], [["A", "B", 5], ["A", "B", 2]], "A", 2],
  ["zero-minute relay", ["A", "B", "C"], [["A", "B", 0], ["B", "C", 4]], "A", 4],
  ["cycle", ["A", "B", "C"], [["A", "B", 1], ["B", "A", 1], ["B", "C", 4]], "A", 5],
  ["isolated town", ["A", "B", "C"], [["A", "B", 3]], "A", -1],
  [
    "slowest town is not the farthest in hops",
    ["HQ", "N", "S", "E", "W"],
    [["HQ", "N", 2], ["HQ", "S", 9], ["N", "E", 2], ["E", "W", 2]],
    "HQ",
    9,
  ],
];

for (const [name, towns, relays, source, expected] of cases) {
  run(name, () => check(name, broadcastTime(towns, relays, source), expected));
}

run("large network: 20,000 towns, 80,000 relays (should be instant)", () => {
  let seed = 2024;
  const rand = () => (seed = (seed * 48271) % 2147483647);
  const n = 20000;
  const towns = Array.from({ length: n }, (_, i) => `t${i}`);
  const relays = [];
  for (let i = 0; i + 1 < n; i++) relays.push([towns[i], towns[i + 1], 1 + (rand() % 100)]);
  for (let j = 0; j < 60001; j++) relays.push([towns[rand() % n], towns[rand() % n], 1 + (rand() % 1000)]);
  const start = Date.now();
  const result = broadcastTime(towns, relays, "t0");
  const ms = Date.now() - start;
  check(`large network (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: 1532, fast: true });
});
