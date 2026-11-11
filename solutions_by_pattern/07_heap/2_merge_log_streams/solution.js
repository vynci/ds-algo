// Run: node solution.js
// Merge Log Streams (LeetCode #23 Merge k Sorted Lists). See tutorial.md.

// The same MinHeap as in 1_kth_largest_upload.
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

function mergeStreams(streams) {
  // Each heap entry is a "cursor": which stream, and which position in it.
  // Order by timestamp, then by stream index (the tie rule).
  const heap = new MinHeap((a, b) => {
    const tsA = streams[a.stream][a.index].ts;
    const tsB = streams[b.stream][b.index].ts;
    return tsA - tsB || a.stream - b.stream;
  });

  // Start with the FIRST entry of every non-empty stream. The heap never holds more than k cursors.
  streams.forEach((entries, stream) => {
    if (entries.length > 0) heap.push({ stream, index: 0 });
  });

  const merged = [];
  while (heap.size > 0) {
    const { stream, index } = heap.pop(); // the earliest entry across all stream fronts
    merged.push(streams[stream][index]); // the original object, not a copy

    // Advance that stream's cursor. We only READ the input and never shift() it.
    if (index + 1 < streams[stream].length) {
      heap.push({ stream, index: index + 1 });
    }
  }

  return merged;
}

// The baseline: flatten + stable sort. O(N log N). It passes the tests, and is good to mention first.
function mergeStreamsBaseline(streams) {
  return streams.flat().sort((a, b) => a.ts - b.ts); // stable: ties keep stream order, then position
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

const e = (ts, msg) => ({ ts, msg });
const msgs = (entries) => (Array.isArray(entries) ? entries.map((x) => x.msg) : entries);

run("example", () => {
  const streams = [
    [e(1, "api: start"), e(4, "api: request"), e(9, "api: stop")],
    [e(2, "db: start"), e(4, "db: query")],
    [e(3, "web: start")],
  ];
  check("example", msgs(mergeStreams(streams)), [
    "api: start",
    "db: start",
    "web: start",
    "api: request",
    "db: query",
    "api: stop",
  ]);
});

run("no streams", () => check("no streams", mergeStreams([]), []));

run("all streams empty", () => check("all streams empty", mergeStreams([[], [], []]), []));

run("one stream", () => {
  check("one stream", msgs(mergeStreams([[e(1, "a"), e(2, "b")]])), ["a", "b"]);
});

run("some empty streams", () => {
  const streams = [[], [e(5, "x")], [], [e(1, "y"), e(6, "z")]];
  check("some empty streams", msgs(mergeStreams(streams)), ["y", "x", "z"]);
});

run("ties: lower stream first, same-stream order kept", () => {
  const streams = [
    [e(1, "s0-a"), e(1, "s0-b")],
    [e(1, "s1-a")],
    [e(0, "s2-a"), e(1, "s2-b")],
  ];
  check("ties: lower stream first, same-stream order kept", msgs(mergeStreams(streams)), [
    "s2-a",
    "s0-a",
    "s0-b",
    "s1-a",
    "s2-b",
  ]);
});

run("returns the original entry objects", () => {
  const entry = e(1, "same object");
  const [out] = mergeStreams([[entry]]);
  check("returns the original entry objects", out === entry, true);
});

run("does not modify the input streams", () => {
  const streams = [[e(1, "a"), e(3, "c")], [e(2, "b")]];
  const before = JSON.stringify(streams);
  const result = mergeStreams(streams);
  check("does not modify the input streams", { count: result.length, unchanged: JSON.stringify(streams) === before }, { count: 3, unchanged: true });
});

run("200 streams x 50 entries vs. a reference merge", () => {
  let seed = 99;
  const rand = () => (seed = (seed * 48271) % 2147483647);
  const streams = Array.from({ length: 200 }, (_, s) => {
    let ts = 0;
    return Array.from({ length: 50 }, (_, i) => e((ts += rand() % 5), `s${s}-${i}`));
  });
  // Flatten in stream order, then a stable sort by ts gives exactly the tie rule above.
  const expected = msgs(streams.flat().sort((a, b) => a.ts - b.ts));
  check("200 streams x 50 entries vs. a reference merge", msgs(mergeStreams(streams)), expected);
});
