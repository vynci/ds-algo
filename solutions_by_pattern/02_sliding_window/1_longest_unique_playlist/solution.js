// Run: node solution.js
// Longest Unique Playlist (LeetCode #3). See tutorial.md for the walkthrough.

function longestUniqueStreak(history) {
  const lastSeen = new Map(); // song -> the last index where it was played
  let left = 0; // the window is history[left .. right] and has no repeats
  let best = { start: 0, length: 0 };

  for (let right = 0; right < history.length; right++) {
    const song = history[right];

    // If this song is already INSIDE the window, jump `left` just past its last play.
    // Math.max matters: if the last play was BEFORE the window, `left` must not move backwards.
    if (lastSeen.has(song)) {
      left = Math.max(left, lastSeen.get(song) + 1);
    }
    lastSeen.set(song, right);

    const length = right - left + 1;
    if (length > best.length) {
      // strictly greater, so on a tie we keep the EARLIEST streak
      best = { start: left, length };
    }
  }

  return best;
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
  ["example", ["Intro", "Dreams", "Intro", "Hurt", "Halo", "Dreams", "Halo"], { start: 1, length: 4 }],
  ["repeating block", ["a", "b", "c", "a", "b", "c", "b", "b"], { start: 0, length: 3 }],
  ["same song on loop", ["x", "x", "x"], { start: 0, length: 1 }],
  ["streak in the middle", ["p", "w", "w", "k", "e", "w"], { start: 2, length: 3 }],
  ["streak at the end", ["d", "v", "d", "f"], { start: 1, length: 3 }],
  ["abba trap: don't move left backwards", ["a", "b", "b", "a"], { start: 0, length: 2 }],
  ["all unique", ["one", "two", "three"], { start: 0, length: 3 }],
  ["case-sensitive titles", ["Halo", "halo"], { start: 0, length: 2 }],
  ["empty", [], { start: 0, length: 0 }],
];

for (const [name, history, expected] of cases) {
  run(name, () => check(name, longestUniqueStreak(history), expected));
}

run("large input (should be instant)", () => {
  const history = Array.from({ length: 200000 }, (_, i) => `song-${(i * 31) % 997}`);
  const start = Date.now();
  const result = longestUniqueStreak(history);
  const ms = Date.now() - start;
  check(`large input (${ms}ms, should be well under 1000ms)`, { result, fast: ms < 1000 }, { result: { start: 0, length: 997 }, fast: true });
});
