/**
 * Problem: Count the islands. 1 is land and 0 is water. An island is a group of land cells connected up, down, left, or right.
 */

function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function sink(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return; // outside grid
    if (grid[r][c] === 0) return; // water or already sunk

    grid[r][c] = 0; // sink this cell

    for (const [dr, dc] of directions) {
      sink(r + dr, c + dc); // go deeper into the island
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        count++; // found a new island
        sink(r, c); // erase all of it
      }
    }
  }

  return count;
}

const map = [
  [1, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1],
  [1, 0, 0, 0],
];

console.log(numIslands(map)); // 3
