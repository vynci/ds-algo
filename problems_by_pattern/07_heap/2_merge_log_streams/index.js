// Run: node index.js

// Paste your MinHeap from ../1_kth_largest_upload/index.js here.
class MinHeap {
  // TODO
}

function mergeStreams(streams) {
  // TODO
}

// ---- tests ----

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
