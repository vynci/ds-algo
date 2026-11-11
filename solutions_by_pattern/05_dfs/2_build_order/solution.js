// Run: node solution.js
// Build Order (LeetCode #210 Course Schedule II). See tutorial.md.
//
// Two solutions:
//   buildOrder          - Kahn's algorithm (BFS on in-degrees). Iterative, so a deep chain is fine. This is the one tested.
//   buildOrderRecursive - DFS with 3 states. The classic answer, but recursion depth limits it.

function buildOrder(packages, deps) {
  // waitingCount[pkg] = how many of pkg's dependencies are NOT built yet (its "in-degree")
  // unlocks[dep]      = the packages waiting on `dep`
  const waitingCount = new Map(packages.map((p) => [p, 0]));
  const unlocks = new Map(packages.map((p) => [p, []]));

  for (const [pkg, dependsOn] of deps) {
    waitingCount.set(pkg, waitingCount.get(pkg) + 1);
    unlocks.get(dependsOn).push(pkg);
  }

  // Start with everything that has no dependencies.
  const ready = packages.filter((p) => waitingCount.get(p) === 0);
  const order = [];

  // `ready` doubles as a queue. A head index avoids O(n) shift().
  for (let head = 0; head < ready.length; head++) {
    const pkg = ready[head];
    order.push(pkg); // "build" it

    for (const waiting of unlocks.get(pkg)) {
      const left = waitingCount.get(waiting) - 1;
      waitingCount.set(waiting, left);
      if (left === 0) ready.push(waiting); // its last dependency just finished
    }
  }

  // Packages in a cycle never reach 0, so they never get built.
  return order.length === packages.length ? order : null;
}

// ---------------------------------------------------------------------------
// The DFS version: post-order traversal + 3-state cycle detection.

const UNVISITED = 0;
const VISITING = 1; // currently on the recursion path
const DONE = 2; // fully explored, with all its dependencies already in `order`

function buildOrderRecursive(packages, deps) {
  const dependsOn = new Map(packages.map((p) => [p, []]));
  for (const [pkg, dep] of deps) dependsOn.get(pkg).push(dep);

  const state = new Map(packages.map((p) => [p, UNVISITED]));
  const order = [];

  // Returns false if a cycle is found.
  function visit(pkg) {
    if (state.get(pkg) === VISITING) return false; // back on our own path: a cycle
    if (state.get(pkg) === DONE) return true; // already built (a diamond, NOT a cycle)

    state.set(pkg, VISITING);
    for (const dep of dependsOn.get(pkg)) {
      if (!visit(dep)) return false;
    }
    state.set(pkg, DONE);
    order.push(pkg); // post-order: every dependency was pushed before us
    return true;
  }

  for (const pkg of packages) {
    if (!visit(pkg)) return null; // start from EVERY package: the graph may be disconnected
  }
  return order;
}

// ---- tests (identical to the problem's index.js) ----

// Many orders can be valid, so we check the RULES instead of one exact answer.
function checkValidOrder(name, order, packages, deps) {
  const problems = [];
  if (!Array.isArray(order)) {
    problems.push(`expected an array, got ${JSON.stringify(order)}`);
  } else {
    if (order.length !== packages.length) problems.push(`has ${order.length} packages, expected ${packages.length}`);
    if (new Set(order).size !== order.length) problems.push("contains duplicates");
    const inOrder = new Set(order);
    for (const pkg of packages) if (!inOrder.has(pkg)) problems.push(`missing "${pkg}"`);
    const position = new Map(order.map((pkg, i) => [pkg, i]));
    for (const [pkg, dependsOn] of deps) {
      if (position.get(dependsOn) > position.get(pkg)) problems.push(`"${dependsOn}" must come before "${pkg}"`);
    }
  }
  console.log(`${problems.length === 0 ? "PASS" : "FAIL"}  ${name}`);
  if (problems.length) console.log(`      ${problems.join("\n      ")}\n      got: ${JSON.stringify(order)}`);
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

const valid = [
  [
    "example",
    ["app", "ui", "api", "db", "utils"],
    [["app", "ui"], ["app", "api"], ["api", "db"], ["ui", "utils"], ["api", "utils"]],
  ],
  ["no dependencies", ["x", "y", "z"], []],
  ["simple chain", ["c", "b", "a"], [["c", "b"], ["b", "a"]]],
  ["diamond is NOT a cycle", ["top", "left", "right", "base"], [["top", "left"], ["top", "right"], ["left", "base"], ["right", "base"]]],
  ["disconnected groups", ["a", "b", "c", "d"], [["b", "a"], ["d", "c"]]],
  ["empty", [], []],
];

for (const [name, packages, deps] of valid) {
  run(name, () => checkValidOrder(name, buildOrder(packages, deps), packages, deps));
}

const cyclic = [
  ["three-way cycle", ["a", "b", "c"], [["a", "b"], ["b", "c"], ["c", "a"]]],
  ["depends on itself", ["a"], [["a", "a"]]],
  ["cycle hidden in a disconnected part", ["x", "y", "a", "b"], [["y", "x"], ["a", "b"], ["b", "a"]]],
  ["cycle reachable from a valid part", ["app", "lib", "core", "util"], [["app", "lib"], ["lib", "core"], ["core", "util"], ["util", "lib"]]],
];

for (const [name, packages, deps] of cyclic) {
  run(name, () => check(name, buildOrder(packages, deps), null));
}

// Recursive DFS goes 20,000 calls deep here and overflows the stack.
// An explicit stack or Kahn's algorithm passes. See follow-up 5 in problem.md.
run("long chain, 20,000 packages (recursion depth trap)", () => {
  const chain = Array.from({ length: 20000 }, (_, i) => `pkg${i}`);
  const deps = chain.slice(1).map((pkg, i) => [pkg, chain[i]]); // pkgN depends on pkgN-1
  const packages = [...chain].reverse(); // listed top-down, so a DFS has to go all the way to the bottom
  checkValidOrder("long chain, 20,000 packages (recursion depth trap)", buildOrder(packages, deps), packages, deps);
});
