function gridBfs(input) {
  // 1. Setup enviornment
  const R = input.length;
  const C = input[0].length;

  const startX = 0,
    startY = 0;
  const goalX = R - 1,
    goalY = C - 1;

  const distance = Array.from({ length: R }, () => Array(C).fill(-1));
  const queue = [[startX, startY]];
  distance[startX][startY] = 0;
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
    if (x === goalX && y === goalY) return distance[x][y];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      // Conditions
      if (!inBounds(nx, ny)) continue;
      if (distance[nx][ny] !== -1) continue;

      distance[nx][ny] = distance[x][y] + 1;

      queue.push([nx, ny]);
    }

    console.log("distance", distance);
    console.log("queue", queue);
  }

  return -1;
}

const input = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

gridBfs(input);
