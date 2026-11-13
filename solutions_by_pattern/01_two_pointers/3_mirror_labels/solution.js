// Run: node solution.js
// Mirror Labels (LeetCode #125 Valid Palindrome + #680 Valid Palindrome II). See tutorial.md.

// ---------------------------------------------------------------------------
// Part 1: ignore case and anything that isn't a letter or a digit.

// No /g flag! A /g regex remembers `lastIndex` between .test() calls and starts giving wrong answers.
const LETTER_OR_DIGIT = /^[a-z0-9]$/i;

function isMirrorLabel(label) {
  let left = 0;
  let right = label.length - 1;

  while (left < right) {
    // Skip junk on each side. `left < right` stops the pointers from crossing when the
    // rest of the label is all junk (e.g. ".,!? ").
    while (left < right && !LETTER_OR_DIGIT.test(label[left])) left++;
    while (left < right && !LETTER_OR_DIGIT.test(label[right])) right--;

    // Both pointers are on a letter/digit (or have met, which compares a char with itself).
    if (label[left].toLowerCase() !== label[right].toLowerCase()) return false;

    // This pair matches and is never needed again: move both inward.
    left++;
    right--;
  }

  return true; // pointers met or crossed with no mismatch (also covers "" and one character)
}

// The simple first answer: build a cleaned copy and compare it with its reverse.
// Correct and easy to say out loud, but it uses O(n) extra space for the copies.
function isMirrorLabelWithCopy(label) {
  const cleaned = label.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === [...cleaned].reverse().join("");
}

// ---------------------------------------------------------------------------
// Part 2: lowercase letters only; you may delete at most one character.

// Is code[left..right] (inclusive) a mirror, with no deletions allowed?
function isMirrorBetween(code, left, right) {
  while (left < right) {
    if (code[left] !== code[right]) return false;
    left++;
    right--;
  }
  return true;
}

function isMirrorWithOneSlip(code) {
  let left = 0;
  let right = code.length - 1;

  while (left < right) {
    if (code[left] !== code[right]) {
      // First mismatch: one of these two characters is the stray, and we can't tell which.
      // So try BOTH, and spend the one deletion on each:
      //   skip the left one  -> is code[left+1 .. right] a mirror?
      //   skip the right one -> is code[left .. right-1] a mirror?
      // Each check is a plain O(n) scan with no further deletions.
      return isMirrorBetween(code, left + 1, right) || isMirrorBetween(code, left, right - 1);
    }
    // Matching ends: deleting either one could never help, so move inward.
    left++;
    right--;
  }

  return true; // no mismatch at all: already a mirror
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

console.log("--- Part 1: isMirrorLabel ---");

const labelCases = [
  ["example", "Was it a car or a cat I saw?", true],
  ["warehouse label", "Order #2112-REDRO", true],
  ["not a mirror", "race a car", false],
  ["digits count (trap: a letters-only filter drops the 0)", "0P", false],
  ["digit in the middle must match too", "1a2", false],
  ["case is ignored", "Aa", true],
  ["only punctuation (trap: pointers run off the ends)", ".,!? ", true],
  ["empty label", "", true],
  ["single character", "x", true],
  ["junk on the right only", "a..", true],
  ["junk on the left only", "...ab", false],
  ["junk everywhere", "...aB.A", true],
  ["ANY junk counts (trap: a list of specific symbols to remove)", "A man, a plan, a canal: Panama", true],
  ["apostrophes are junk too", "Madam, I'm Adam", true],
];

for (const [name, label, expected] of labelCases) {
  run(name, () => check(name, isMirrorLabel(label), expected));
}

run("long label: 375,000 characters (should be instant)", () => {
  let seed = 5;
  const rand = () => (seed = (seed * 48271) % 2147483647);
  const parts = [];
  for (let i = 0; i < 150000; i++) {
    const ch = "abcdefghijklmnopqrstuvwxyz0123456789"[rand() % 36];
    parts.push(rand() % 2 ? ch.toUpperCase() : ch);
    if (rand() % 4 === 0) parts.push(" -.,#"[rand() % 5]);
  }
  const left = parts.join("");
  const right = [...left].reverse().join("");
  const good = left + right;
  const bad = left + "x" + right.slice(1); // one character changed in the middle
  const start = Date.now();
  const result = [isMirrorLabel(good), isMirrorLabel(bad)];
  const ms = Date.now() - start;
  check(`long label (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: [true, false], fast: true });
});

console.log("--- Part 2: isMirrorWithOneSlip ---");

const slipCases = [
  ["example: delete the b or the c", "abca", true],
  ["already a mirror", "racecar", true],
  ["needs two deletions", "abc", false],
  ["two letters: delete either", "ab", true],
  ["single letter", "a", true],
  ["empty code", "", true],
  ["trap: only ever skipping the LEFT side", "aab", true],
  ["trap: only ever skipping the RIGHT side", "baa", true],
  ["trap: greedy picks a side without trying both (1)", "abbab", true],
  ["trap: greedy picks a side without trying both (2)", "babba", true],
  ["stray x and y: two deletions", "abxcdcyba", false],
  ["stray letter in the middle", "abcxdcba", true],
  ["stray letter at the very end", "levelz", true],
];

for (const [name, code, expected] of slipCases) {
  run(name, () => check(name, isMirrorWithOneSlip(code), expected));
}

function makeLongCode(halfLength, strays) {
  let seed = 99;
  const rand = () => (seed = (seed * 48271) % 2147483647);
  const half = Array.from({ length: halfLength }, () => "abcdefghijklmnopqrstuvwxyz"[rand() % 26]).join("");
  let code = half + "m" + [...half].reverse().join("");
  for (const [pos, ch] of strays) code = code.slice(0, pos) + ch + code.slice(pos);
  return code;
}

run("long code: 100,000 letters (trap: O(n^2) 'try deleting each letter', or recursion depth)", () => {
  const oneStray = makeLongCode(50000, [[50003, "q"]]);
  const twoStrays = makeLongCode(50000, [[50003, "q"], [20000, "z"]]);
  const start = Date.now();
  const result = [isMirrorWithOneSlip(oneStray), isMirrorWithOneSlip(twoStrays)];
  const ms = Date.now() - start;
  check(`long code (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: [true, false], fast: true });
});
