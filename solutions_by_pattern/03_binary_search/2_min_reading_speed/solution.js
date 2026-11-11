// Run: node solution.js
// Minimum Reading Speed (LeetCode #875 Koko Eating Bananas). See tutorial.md.

// How many hours to finish every book at `speed` pages/hour?
// Each book takes ceil(pages / speed) hours, because a partly used hour still counts as a full one.
function hoursNeeded(books, speed) {
  let hours = 0;
  for (const pages of books) hours += Math.ceil(pages / speed);
  return hours;
}

function minReadingSpeed(books, hours) {
  // The answer is somewhere in [1, biggest book]:
  //   - 1 is the slowest possible speed.
  //   - max(books) always works: every book takes exactly 1 hour, and hours >= books.length.
  let lo = 1;
  let hi = Math.max(...books);

  // Find the FIRST speed where "fast enough?" is yes. The answers look like:
  //   speed:        1   2   3   4   5   6 ...
  //   fast enough:  no  no  no  YES YES YES  (monotonic, so binary search works)
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hoursNeeded(books, mid) <= hours) {
      hi = mid; // mid works. Maybe something slower works too, so keep mid in range.
    } else {
      lo = mid + 1; // mid is too slow, and so is everything below it
    }
  }

  return lo; // lo === hi: the slowest speed that works
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
