var input = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

function gridBfs(input) {
  // 0. start and goal
  const startX = 0,
    startY = 0;
  const goalX = input.length - 1,
    goalY = input[0].length - 1;

  // 1. setup environment
  const R = input.length;
  const C = input[0].length;

  const dist = Array.from({ length: R }, () => Array(C).fill(-1));

  const queue = [[startX, startY]];
  dist[startX][startY] = 0;

  const directions = [
    [1, 0], // down
    [-1, 0], // up
    [0, 1], // right
    [0, -1], // left
  ];

  const inBounds = (x, y) => x >= 0 && x < R && y >= 0 && y < C;

  // 2. Main Loop
  for (let head = 0; head < queue.length; head++) {
    const [x, y] = queue[head];

    // exit
    if (x === goalX && y === goalY) return dist[x][y];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (!inBounds(nx, ny)) continue;
      if (input[nx][ny] !== 0) continue; // not a wall
      if (dist[nx][ny] !== -1) continue; // already visited

      dist[nx][ny] = dist[x][y] + 1;

      queue.push([nx, ny]);
    }
    console.log("--------");
    console.log("dist", dist);
    console.log(`queue [${queue.length}]:`, queue);
  }

  return -1;
}
console.log("--- \noutput", gridBfs(input));
