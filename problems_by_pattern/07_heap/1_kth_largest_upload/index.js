// Run: node index.js

class MinHeap {
  constructor(compare = (a, b) => a - b) {
    // TODO
  }

  get size() {
    // TODO
  }

  push(value) {
    // TODO
  }

  pop() {
    // TODO
  }

  peek() {
    // TODO
  }
}

function kthLargest(sizes, k) {
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

console.log("-- Part 1: MinHeap --");

run("push/peek/pop basics", () => {
  const h = new MinHeap();
  h.push(5);
  h.push(2);
  h.push(8);
  check("push/peek/pop basics", [h.size, h.peek(), h.pop(), h.pop(), h.size], [3, 2, 2, 5, 1]);
});

run("empty heap", () => {
  const h = new MinHeap();
  check(
    "empty heap",
    { size: h.size, peekIsUndefined: h.peek() === undefined, popIsUndefined: h.pop() === undefined, sizeAfter: h.size },
    { size: 0, peekIsUndefined: true, popIsUndefined: true, sizeAfter: 0 },
  );
});

run("pop down to empty and reuse", () => {
  const h = new MinHeap();
  h.push(1);
  const first = h.pop();
  h.push(4);
  h.push(3);
  check("pop down to empty and reuse", [first, h.pop(), h.pop(), h.pop() === undefined], [1, 3, 4, true]);
});

run("pops 1000 random numbers in sorted order", () => {
  const h = new MinHeap();
  let seed = 7;
  const values = [];
  for (let i = 0; i < 1000; i++) {
    seed = (seed * 48271) % 2147483647;
    values.push(seed % 500); // plenty of duplicates
    h.push(values[i]);
  }
  const popped = [];
  while (h.size > 0) popped.push(h.pop());
  check("pops 1000 random numbers in sorted order", popped, [...values].sort((a, b) => a - b));
});

run("custom comparator: max-heap", () => {
  const h = new MinHeap((a, b) => b - a);
  for (const x of [3, 9, 1, 7]) h.push(x);
  check("custom comparator: max-heap", [h.pop(), h.pop(), h.pop(), h.pop()], [9, 7, 3, 1]);
});

run("custom comparator: objects", () => {
  const h = new MinHeap((a, b) => a.mb - b.mb);
  h.push({ file: "video.mp4", mb: 900 });
  h.push({ file: "notes.txt", mb: 1 });
  h.push({ file: "photo.jpg", mb: 4 });
  check("custom comparator: objects", [h.pop().file, h.pop().file, h.pop().file], ["notes.txt", "photo.jpg", "video.mp4"]);
});

run("push/pop are O(log n), not a sort per call", () => {
  const h = new MinHeap();
  const start = Date.now();
  for (let i = 100000; i > 0; i--) h.push(i);
  let last = 0;
  let inOrder = true;
  let popped = 0;
  while (h.size > 0) {
    const x = h.pop();
    if (x < last) inOrder = false;
    last = x;
    popped++;
  }
  const ms = Date.now() - start;
  check(
    `100k pushes + pops (${ms}ms, should be well under 1000ms)`,
    { popped, inOrder, fast: ms < 1000 },
    { popped: 100000, inOrder: true, fast: true },
  );
});

console.log("-- Part 2: kthLargest --");

const cases = [
  ["example 1", [3, 2, 1, 5, 6, 4], 2, 5],
  ["example 2", [3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4],
  ["single upload", [42], 1, 42],
  ["duplicates count separately", [7, 7, 7], 2, 7],
  ["k = n means the smallest", [9, 4, 6], 3, 4],
  ["k = 1 means the largest", [9, 4, 6], 1, 9],
  ["negative values", [-1, -5, -3], 3, -5],
];

for (const [name, sizes, k, expected] of cases) {
  run(name, () => check(name, kthLargest(sizes, k), expected));
}

run("does not mutate sizes", () => {
  const sizes = [5, 1, 4];
  const result = kthLargest(sizes, 2);
  check("does not mutate sizes", { result, sizes }, { result: 4, sizes: [5, 1, 4] });
});
