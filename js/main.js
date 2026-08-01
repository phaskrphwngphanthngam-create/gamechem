const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = new Player(400, 300);

// เปลี่ยนการสร้างบอลมาใช้ Class CheckBall (ที่มี Pixel Art + ลูกศรสีส้ม)
let balls = [
  new CheckBall(200, 150, 0),
  new CheckBall(600, 150, 1)
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

  // สั่งวาดบอลคำถามแต่ละลูกด้วยวิธี Pixel Art ของ CheckBall
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