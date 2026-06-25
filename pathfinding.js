// ═══════════════════════════════════════════════════════
// PATHFINDING ALGORITHMS
// ═══════════════════════════════════════════════════════

const ROWS = 22, COLS = 52;
let grid = [], mouseDown = false, visitedCount = 0;
let startNode = { r: 10, c: 8 }, endNode = { r: 10, c: 43 };
let isRunning = false;

const ALGO_DESCRIPTIONS = {
  dijkstra: "Dijkstra's Algorithm — Weighted, guarantees shortest path by expanding lowest-cost nodes first.",
  astar:    "A* Search — Weighted, uses heuristic (Manhattan distance) to find shortest path faster than Dijkstra's.",
  bfs:      "Breadth-First Search — Unweighted, guarantees shortest path (fewest edges) by exploring level by level.",
  dfs:      "Depth-First Search — Unweighted, does NOT guarantee shortest path. Explores as deep as possible first.",
  greedy:   "Greedy Best-First Search — Weighted, fast but does NOT guarantee shortest path. Heuristic-driven.",
};

function buildGrid() {
  grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push({
        r, c,
        isWall: false, isWeight: false, isVisited: false,
        isStart: r === startNode.r && c === startNode.c,
        isEnd:   r === endNode.r   && c === endNode.c,
        prev: null, dist: Infinity, f: Infinity, g: Infinity, h: 0,
      });
    }
    grid.push(row);
  }
}

function renderGrid() {
  const el = document.getElementById('grid');
  el.style.gridTemplateColumns = `repeat(${COLS}, 26px)`;
  el.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.id = `cell-${r}-${c}`;
      const node = grid[r][c];
      if (node.isStart)  cell.classList.add('start');
      if (node.isEnd)    cell.classList.add('end');
      if (node.isWall)   cell.classList.add('wall');
      if (node.isWeight) cell.classList.add('weight');
      cell.addEventListener('mousedown', () => { if (!isRunning) { mouseDown = true; toggleCell(r, c); } });
      cell.addEventListener('mouseenter', () => { if (!isRunning && mouseDown) toggleCell(r, c); });
      cell.addEventListener('mouseup', () => { mouseDown = false; });
      el.appendChild(cell);
    }
  }
  document.addEventListener('mouseup', () => { mouseDown = false; });
}

function toggleCell(r, c) {
  const node = grid[r][c];
  if (node.isStart || node.isEnd) return;
  const mode = document.getElementById('draw-mode').value;
  const cellEl = document.getElementById(`cell-${r}-${c}`);
  if (mode === 'wall') {
    node.isWall = !node.isWall;
    node.isWeight = false;
    cellEl.classList.toggle('wall', node.isWall);
    cellEl.classList.remove('weight');
  } else {
    node.isWeight = !node.isWeight;
    node.isWall = false;
    cellEl.classList.toggle('weight', node.isWeight);
    cellEl.classList.remove('wall');
  }
}

function clearBoard() {
  if (isRunning) return;
  buildGrid();
  renderGrid();
  document.getElementById('path-stats').textContent = '';
  document.getElementById('algo-desc').textContent = 'Select an algorithm and click Visualize';
}

function clearPath() {
  if (isRunning) return;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      node.isVisited = false; node.prev = null;
      node.dist = Infinity; node.f = Infinity; node.g = Infinity; node.h = 0;
      const el = document.getElementById(`cell-${r}-${c}`);
      el.classList.remove('visited', 'path', 'visited-instant', 'path-instant');
    }
  }
  document.getElementById('path-stats').textContent = '';
}

// ── MAZE GENERATION (Recursive Division) ────────────────
function generateMaze() {
  if (isRunning) return;
  clearBoard();
  // border walls
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (r === 0 || r === ROWS-1 || c === 0 || c === COLS-1) {
        const node = grid[r][c];
        if (!node.isStart && !node.isEnd) {
          node.isWall = true;
          document.getElementById(`cell-${r}-${c}`).classList.add('wall');
        }
      }
    }
  }
  recursiveDivide(1, ROWS-2, 1, COLS-2, chooseOrientation(ROWS-2, COLS-2));
}

function recursiveDivide(rStart, rEnd, cStart, cEnd, orientation) {
  if (rEnd - rStart < 2 || cEnd - cStart < 2) return;
  if (orientation === 'H') {
    const wallRow = randEven(rStart, rEnd);
    const passCol = randOdd(cStart, cEnd);
    for (let c = cStart; c <= cEnd; c++) {
      if (c !== passCol) {
        const node = grid[wallRow][c];
        if (!node.isStart && !node.isEnd) {
          node.isWall = true;
          document.getElementById(`cell-${wallRow}-${c}`).classList.add('wall');
        }
      }
    }
    recursiveDivide(rStart, wallRow-1, cStart, cEnd, chooseOrientation(wallRow-1-rStart, cEnd-cStart));
    recursiveDivide(wallRow+1, rEnd, cStart, cEnd, chooseOrientation(rEnd-wallRow-1, cEnd-cStart));
  } else {
    const wallCol = randEven(cStart, cEnd);
    const passRow = randOdd(rStart, rEnd);
    for (let r = rStart; r <= rEnd; r++) {
      if (r !== passRow) {
        const node = grid[r][wallCol];
        if (!node.isStart && !node.isEnd) {
          node.isWall = true;
          document.getElementById(`cell-${r}-${wallCol}`).classList.add('wall');
        }
      }
    }
    recursiveDivide(rStart, rEnd, cStart, wallCol-1, chooseOrientation(rEnd-rStart, wallCol-1-cStart));
    recursiveDivide(rStart, rEnd, wallCol+1, cEnd, chooseOrientation(rEnd-rStart, cEnd-wallCol-1));
  }
}
function chooseOrientation(h, w) { return h > w ? 'H' : w > h ? 'V' : (Math.random() < 0.5 ? 'H' : 'V'); }
function randEven(lo, hi) {
  const evens = [];
  for (let i = lo + (lo % 2 === 0 ? 0 : 1); i <= hi; i += 2) evens.push(i);
  return evens[Math.floor(Math.random() * evens.length)] || lo + 1;
}
function randOdd(lo, hi) {
  const odds = [];
  for (let i = lo + (lo % 2 === 1 ? 0 : 1); i <= hi; i += 2) odds.push(i);
  return odds[Math.floor(Math.random() * odds.length)] || lo;
}

// ── MAIN VISUALIZE ───────────────────────────────────────
async function startPathfinding() {
  if (isRunning) return;
  const algo = document.getElementById('path-algo').value;
  document.getElementById('algo-desc').textContent = ALGO_DESCRIPTIONS[algo];
  document.getElementById('path-stats').textContent = '';
  clearPath();
  isRunning = true;
  setPathButtons(true);

  const start = grid[startNode.r][startNode.c];
  const end   = grid[endNode.r][endNode.c];
  let result;

  if (algo === 'dijkstra') result = dijkstra(grid, start, end);
  else if (algo === 'astar') result = astar(grid, start, end);
  else if (algo === 'bfs')   result = bfs(grid, start, end);
  else if (algo === 'dfs')   result = dfs(grid, start, end);
  else if (algo === 'greedy') result = greedyBFS(grid, start, end);

  await animatePath(result.visited, result.path);
  document.getElementById('path-stats').textContent =
    `Visited: ${result.visited.length} nodes | Path: ${result.path.length} nodes`;
  isRunning = false;
  setPathButtons(false);
}

function setPathButtons(running) {
  ['startPathfinding','generateMaze','clearBoard','clearPath'].forEach(fn => {
    const btns = document.querySelectorAll('#panel-path .btn');
    btns.forEach(b => { b.disabled = running; });
  });
}

function getSpeed() {
  const s = document.getElementById('path-speed').value;
  return s === 'fast' ? 8 : s === 'medium' ? 30 : 80;
}

async function animatePath(visited, path) {
  const delay = getSpeed();
  for (const node of visited) {
    if (node.isStart || node.isEnd) continue;
    await sleep(delay);
    document.getElementById(`cell-${node.r}-${node.c}`).classList.add('visited');
  }
  await sleep(200);
  for (const node of path) {
    if (node.isStart || node.isEnd) continue;
    await sleep(delay * 2);
    document.getElementById(`cell-${node.r}-${node.c}`).classList.add('path');
  }
}

// ── DIJKSTRA ────────────────────────────────────────────
function dijkstra(grid, start, end) {
  const visited = [];
  start.dist = 0;
  const unvisited = getAllNodes(grid);
  while (unvisited.length) {
    unvisited.sort((a, b) => a.dist - b.dist);
    const closest = unvisited.shift();
    if (closest.isWall) continue;
    if (closest.dist === Infinity) break;
    closest.isVisited = true;
    visited.push(closest);
    if (closest === end) return { visited, path: getPath(end) };
    updateNeighborsDijkstra(closest, grid);
  }
  return { visited, path: [] };
}
function updateNeighborsDijkstra(node, grid) {
  for (const nb of getNeighbors(node, grid)) {
    if (nb.isVisited) continue;
    const cost = nb.isWeight ? 3 : 1;
    const nd = node.dist + cost;
    if (nd < nb.dist) { nb.dist = nd; nb.prev = node; }
  }
}

// ── A* ─────────────────────────────────────────────────
function astar(grid, start, end) {
  const visited = [], open = [];
  start.g = 0; start.h = manhattan(start, end); start.f = start.h;
  open.push(start);
  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    if (current.isWall) continue;
    if (current.isVisited) continue;
    current.isVisited = true;
    visited.push(current);
    if (current === end) return { visited, path: getPath(end) };
    for (const nb of getNeighbors(current, grid)) {
      if (nb.isVisited || nb.isWall) continue;
      const cost = nb.isWeight ? 3 : 1;
      const tentG = current.g + cost;
      if (tentG < nb.g) {
        nb.prev = current; nb.g = tentG;
        nb.h = manhattan(nb, end); nb.f = nb.g + nb.h;
        if (!open.includes(nb)) open.push(nb);
      }
    }
  }
  return { visited, path: [] };
}
function manhattan(a, b) { return Math.abs(a.r - b.r) + Math.abs(a.c - b.c); }

// ── BFS ─────────────────────────────────────────────────
function bfs(grid, start, end) {
  const visited = [], queue = [start];
  start.isVisited = true;
  while (queue.length) {
    const node = queue.shift();
    if (node.isWall) continue;
    visited.push(node);
    if (node === end) return { visited, path: getPath(end) };
    for (const nb of getNeighbors(node, grid)) {
      if (!nb.isVisited && !nb.isWall) {
        nb.isVisited = true; nb.prev = node; queue.push(nb);
      }
    }
  }
  return { visited, path: [] };
}

// ── DFS ─────────────────────────────────────────────────
function dfs(grid, start, end) {
  const visited = [], stack = [start];
  while (stack.length) {
    const node = stack.pop();
    if (node.isVisited || node.isWall) continue;
    node.isVisited = true; visited.push(node);
    if (node === end) return { visited, path: getPath(end) };
    for (const nb of getNeighbors(node, grid)) {
      if (!nb.isVisited && !nb.isWall) { nb.prev = node; stack.push(nb); }
    }
  }
  return { visited, path: [] };
}

// ── GREEDY BFS ──────────────────────────────────────────
function greedyBFS(grid, start, end) {
  const visited = [], open = [start];
  start.isVisited = true;
  while (open.length) {
    open.sort((a, b) => manhattan(a, end) - manhattan(b, end));
    const node = open.shift();
    if (node.isWall) continue;
    visited.push(node);
    if (node === end) return { visited, path: getPath(end) };
    for (const nb of getNeighbors(node, grid)) {
      if (!nb.isVisited && !nb.isWall) {
        nb.isVisited = true; nb.prev = node; open.push(nb);
      }
    }
  }
  return { visited, path: [] };
}

// ── HELPERS ─────────────────────────────────────────────
function getNeighbors(node, grid) {
  const { r, c } = node, nb = [];
  if (r > 0)        nb.push(grid[r-1][c]);
  if (r < ROWS-1)   nb.push(grid[r+1][c]);
  if (c > 0)        nb.push(grid[r][c-1]);
  if (c < COLS-1)   nb.push(grid[r][c+1]);
  return nb;
}
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) for (const node of row) nodes.push(node);
  return nodes;
}
function getPath(endNode) {
  const path = []; let cur = endNode;
  while (cur) { path.unshift(cur); cur = cur.prev; }
  return path;
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
