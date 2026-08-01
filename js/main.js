const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = new Player(400, 300);

let balls = [
  { x: 200, y: 150, qIndex: 0, active: true },
  { x: 600, y: 150, qIndex: 1, active: true }
];

function update() {
  // หยุดเดินถ้ามี Pop-up เปิดอยู่
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

  // วาดจุดคำถาม
  balls.forEach(ball => {
    if (ball.active) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    }
  });

  player.draw(ctx);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();