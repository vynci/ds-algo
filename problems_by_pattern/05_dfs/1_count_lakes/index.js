// Run: node index.js

function surveyLakes(map) {
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
  ["example", ["~~#", "~##", "#~~"], { count: 2, largest: 3 }],
  ["all land", ["###", "###"], { count: 0, largest: 0 }],
  ["single water cell", ["~"], { count: 1, largest: 1 }],
  ["diagonals don't connect", ["~#", "#~"], { count: 2, largest: 1 }],
  ["empty map", [], { count: 0, largest: 0 }],
  ["U-shaped lake is one lake", ["~#~", "~#~", "~~~"], { count: 1, largest: 7 }],
  [
    "several lakes",
    ["~~##~", "~###~", "##~##", "~####", "~~#~~"],
    { count: 5, largest: 3 },
  ],
  ["ring of water around an island", ["~~~~", "~##~", "~~~~"], { count: 1, largest: 10 }],
];

for (const [name, map, expected] of cases) {
  run(name, () => check(name, surveyLakes(map), expected));
}

run("one giant lake, 300x300 (recursion depth trap)", () => {
  const map = Array.from({ length: 300 }, () => "~".repeat(300));
  check("one giant lake, 300x300 (recursion depth trap)", surveyLakes(map), { count: 1, largest: 90000 });
});
