// Run: node index.js

function allFlagCombos(flags) {
  // TODO
}

// ---- tests ----

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
