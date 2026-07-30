// game.js
// main loop, การควบคุม, และการเปลี่ยนแมพผ่านประตู

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.tabIndex = 0;

let currentMap = "map1";

function tryMove(dx, dy, dir) {
  player.dir = dir;
  const nx = player.x + dx;
  const ny = player.y + dy;
  const t = getTile(currentMap, nx, ny);

  if (t === "1") {
    draw();
    return;
  }

  player.x = nx;
  player.y = ny;
  stepToggle = !stepToggle;

  if (t === "D") {
    const m = maps[currentMap];
    const doorInfo = m.doors[nx + "," + ny];
    if (doorInfo) {
      currentMap = doorInfo.to;
      player.x = doorInfo.spawn[0];
      player.y = doorInfo.spawn[1];
      document.getElementById("mapname").textContent = mapNames[currentMap];
    }
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap(ctx, currentMap);
  drawCharacter(ctx, player.x * TILE, player.y * TILE);
}

const keyMap = {
  ArrowUp: [0, -1, "up"],
  ArrowDown: [0, 1, "down"],
  ArrowLeft: [-1, 0, "left"],
  ArrowRight: [1, 0, "right"],
  w: [0, -1, "up"],
  s: [0, 1, "down"],
  a: [-1, 0, "left"],
  d: [1, 0, "right"],
  W: [0, -1, "up"],
  S: [0, 1, "down"],
  A: [-1, 0, "left"],
  D: [1, 0, "right"],
};

canvas.addEventListener("keydown", (e) => {
  const move = keyMap[e.key];
  if (move) {
    e.preventDefault();
    tryMove(move[0], move[1], move[2]);
  }
});

canvas.addEventListener("click", () => canvas.focus());

draw();
canvas.focus();
