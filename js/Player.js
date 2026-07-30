// player.js
// การวาดตัวละคร 2D และสถานะผู้เล่น

const player = { x: 3, y: 4, dir: "down" };
let stepToggle = false;

function drawCharacter(ctx, px, py) {
  const legOffset = stepToggle ? 3 : -3;
  const cx = px + TILE / 2;

  // เงา
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(cx, py + TILE - 4, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // ขา (ขยับสลับตอนเดิน)
  ctx.fillStyle = "#3C3489";
  ctx.fillRect(
    cx - 7,
    py + 22,
    5,
    10 + (player.dir === "down" || player.dir === "up" ? legOffset : 0)
  );
  ctx.fillRect(
    cx + 2,
    py + 22,
    5,
    10 - (player.dir === "down" || player.dir === "up" ? legOffset : 0)
  );

  // ลำตัว
  ctx.fillStyle = "#378ADD";
  ctx.fillRect(cx - 9, py + 10, 18, 16);

  // แขน
  ctx.fillRect(cx - 12, py + 12, 4, 10);
  ctx.fillRect(cx + 8, py + 12, 4, 10);

  // หัว
  ctx.fillStyle = "#F0997B";
  ctx.beginPath();
  ctx.arc(cx, py + 6, 9, 0, Math.PI * 2);
  ctx.fill();

  // ผม
  ctx.fillStyle = "#2C2C2A";
  ctx.beginPath();
  ctx.arc(cx, py + 2, 9, Math.PI, 0);
  ctx.fill();

  // ตา (หันตามทิศทาง)
  let eyeDX = 0,
    eyeDY = 0;
  if (player.dir === "left") eyeDX = -3;
  if (player.dir === "right") eyeDX = 3;
  if (player.dir === "up") eyeDY = -2;
  if (player.dir === "down") eyeDY = 1;

  if (player.dir !== "up") {
    ctx.beginPath();
    ctx.arc(cx - 3 + eyeDX, py + 6 + eyeDY, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 3 + eyeDX, py + 6 + eyeDY, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
}
