const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- 💡 ปรับขนาด Canvas ให้เต็มหน้าจอแบบอัตโนมัติ ---
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// ปรับขนาดครั้งแรกทันทีที่โหลด + ดักจับ event เวลาผู้เล่นย่อ/ขยายหน้าจอ
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// วางผู้เล่นไว้กลางหน้าจอ
const player = new Player(window.innerWidth / 2, window.innerHeight / 2);

// สร้างลูกบอลคำถาม (สามารถปรับตำแหน่ง x, y ตามแมพใหม่ได้เลย)
let balls = [
  new CheckBall(200, 150, 0),
  new CheckBall(600, 150, 1)
];

function update() {
  // หยุดเดินถ้ามี Pop-up หรือ Modal เปิดอยู่
  if (document.querySelector('.modal[style*="display: flex"]')) return;

  player.update(canvas.width, canvas.height);

  // เช็กการชนจุดคำถาม
  balls.forEach(ball => {
    if (ball.active) {
      let dist = Math.hypot(player.x - ball.x, player.y - ball.y);
      if (dist < player.size + 15) {
        ball.active = false;
        openQuiz(ball.qIndex);
      }
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // วาดลูกบอลคำถาม
  balls.forEach(ball => {
    ball.draw(ctx);
  });

  // วาดตัวละคร Pixel Art
  player.draw(ctx);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();