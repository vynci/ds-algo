// Run: node solution.js
// Feature Flag Combos (LeetCode #78 Subsets). See tutorial.md.

function allFlagCombos(flags) {
  const combos = [];
  const path = []; // the combination being built right now

  function backtrack(start) {
    // EVERY node in the decision tree is a valid subset (not just the leaves),
    // so record the current path immediately. COPY it, because `path` keeps changing.
    combos.push([...path]);

    // Only consider flags from `start` onwards, so we never produce ["b", "a"] after ["a", "b"].
    for (let i = start; i < flags.length; i++) {
      path.push(flags[i]); // choose
      backtrack(i + 1); // explore everything that includes flags[i]
      path.pop(); // un-choose, then try the next flag in this position
    }
  }

  backtrack(0);
  return combos;
}

// Alternative without recursion: each flag doubles the list of subsets.
//   []            -> add "a": [], [a]
//   [], [a]       -> add "b": [], [a], [b], [a, b]
function allFlagCombosIterative(flags) {
  let combos = [[]];
  for (const flag of flags) {
    combos = combos.concat(combos.map((combo) => [...combo, flag]));
  }
  return combos;
}

// Alternative with bitmasks: bit i of `mask` says whether flag i is on.
function allFlagCombosBits(flags) {
  const combos = [];
  for (let mask = 0; mask < 1 << flags.length; mask++) {
    combos.push(flags.filter((_, i) => mask & (1 << i)));
  }
  return combos;
}

// ---- tests (identical to the problem's index.js) ----

// The order of combos doesn't matter, so sort the list of combos before comparing.
// The order INSIDE each combo is kept, because combos must follow the input order.
function checkUnordered(name, actual, expected) {
  const norm = (list) => (Array.isArray(list) ? list.map((x) => JSON.stringify(x)).sort() : list);
  const ok = JSON.stringify(norm(actual)) === JSON.stringify(norm(expected));
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) console.log(`      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`);
}

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

run("example", () =>
  checkUnordered("example", allFlagCombos(["dark_mode", "beta_search"]), [
    [],
    ["dark_mode"],
    ["beta_search"],
    ["dark_mode", "beta_search"],
  ]),
);

run("no flags", () => checkUnordered("no flags", allFlagCombos([]), [[]]));

run("one flag", () => checkUnordered("one flag", allFlagCombos(["new_checkout"]), [[], ["new_checkout"]]));

run("three flags", () =>
  checkUnordered("three flags", allFlagCombos(["a", "b", "c"]), [
    [],
    ["a"],
    ["b"],
    ["c"],
    ["a", "b"],
    ["a", "c"],
    ["b", "c"],
    ["a", "b", "c"],
  ]),
);

run("10 flags -> 1024 unique combos", () => {
  const flags = Array.from({ length: 10 }, (_, i) => `flag${i}`);
  const combos = allFlagCombos(flags);
  const unique = new Set(combos.map((c) => JSON.stringify(c)));
  check("10 flags -> 1024 unique combos", { total: combos.length, unique: unique.size }, { total: 1024, unique: 1024 });
});

run("combos are independent copies", () => {
  // Catches results.push(path) without copying: every combo would share one array.
  const combos = allFlagCombos(["x", "y"]);
  const nonEmpty = combos.filter((c) => c.length > 0).length;
  check("combos are independent copies", nonEmpty, 3);
});
