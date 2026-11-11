// Run: node index.js

function minReadingSpeed(books, hours) {
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

const cases = [
  ["example", [3, 6, 7, 11], 8, 4],
  ["one hour per book", [30, 11, 23, 4, 20], 5, 30],
  ["one spare hour", [30, 11, 23, 4, 20], 6, 23],
  ["single page", [1], 1, 1],
  ["plenty of time", [5, 5, 5], 100, 1],
  ["huge book, two hours", [1000000000], 2, 500000000],
  ["huge book, almost one page per hour", [312884470], 312884469, 2],
];

for (const [name, books, hours, expected] of cases) {
  run(name, () => check(name, minReadingSpeed(books, hours), expected));
}

// A speed-by-speed scan takes several seconds here and fails. Binary search is instant.
run("many big books (should be instant)", () => {
  const books = Array.from({ length: 1000 }, (_, i) => 3000000 - i * 7);
  const start = Date.now();
  const result = minReadingSpeed(books, 1200);
  const ms = Date.now() - start;
  check(`many big books (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: 2998600, fast: true });
});
