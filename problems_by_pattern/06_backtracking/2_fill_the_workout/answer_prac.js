/**
 * Problem: List every subset of [1, 2, 3].
 *
 * Answer: [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]
 *
 * Idea: Build the answer one choice at a time. Each step
 * follows the same three moves: choose a number, explore the choices
 * that follow from it, then undo the choice so you can try the next option.
 * Backtracking is really DFS over a tree of decisions.
 *
 */

function subsets(nums) {
  const result = [];
  const path = [];

  function backtrack(start) {
    result.push([...path]); // every path is a valid subset

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]); // 1. choose
      backtrack(i + 1); // 2. explore
      path.pop(); // 3. undo
    }
  }

  backtrack(0);
  return result;
}

console.log(subsets([1, 2, 3]));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
