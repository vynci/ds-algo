// Run: node index.js

function levelsOf(root) {
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

// Small helper so trees are easy to write: p("Ana", p("Ben"), p("Cara"))
const p = (name, ...reports) => ({ name, reports });

run("example", () => {
  const ana = p("Ana", p("Ben", p("Dev", p("Gus")), p("Eli")), p("Cara", p("Fay")));
  check("example", levelsOf(ana), [["Ana"], ["Ben", "Cara"], ["Dev", "Eli", "Fay"], ["Gus"]]);
});

run("just the CEO", () => check("just the CEO", levelsOf(p("Solo")), [["Solo"]]));

run("null root", () => check("null root", levelsOf(null), []));

run("wide and flat", () => {
  const root = p("Boss", p("A"), p("B"), p("C"), p("D"), p("E"));
  check("wide and flat", levelsOf(root), [["Boss"], ["A", "B", "C", "D", "E"]]);
});

run("uneven branches keep left-to-right order", () => {
  const root = p("R", p("A", p("A1"), p("A2")), p("B"), p("C", p("C1", p("C1a"), p("C1b"))));
  check("uneven branches keep left-to-right order", levelsOf(root), [
    ["R"],
    ["A", "B", "C"],
    ["A1", "A2", "C1"],
    ["C1a", "C1b"],
  ]);
});

run("very deep chain (20,000 levels)", () => {
  let node = p("n19999");
  for (let i = 19998; i >= 0; i--) node = p(`n${i}`, node);
  const levels = levelsOf(node);
  check("very deep chain (20,000 levels)", { count: levels.length, last: levels[levels.length - 1] }, { count: 20000, last: ["n19999"] });
});
