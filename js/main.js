const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 💡 1. กำหนดขนาดแมพจริง (World Bounds) ให้ใหญ่กว่าหน้าจอ
const WORLD_WIDTH = 2400;  // ความกว้างแมพจริง
const WORLD_HEIGHT = 1800; // ความสูงแมพจริง

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 💡 2. ฟังก์ชันสุ่มตำแหน่งลูกบอลทั่วแมพ (ไม่ให้ติดขอบแมพเกินไป)
function generateRandomPositions(count, padding = 150) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      x: Math.floor(Math.random() * (WORLD_WIDTH - padding * 2)) + padding,
      y: Math.floor(Math.random() * (WORLD_HEIGHT - padding * 2)) + padding
    });
  }
  return positions;
}

let currentQuestions = [];
let balls = [];

// 💡 3. ฟังก์ชันสร้างบอลแบบสุ่มสลับคำถาม + สุ่มตำแหน่งแมพ
function initGame() {
  currentQuestions = getRandomQuestions(questions, 10);
  const randomPositions = generateRandomPositions(currentQuestions.length);

  balls = currentQuestions.map((q, index) => {
    return new CheckBall(randomPositions[index].x, randomPositions[index].y, index);
  });
}

// สร้างตัวละครไว้กลางแมพใหญ่
const player = new Player(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);

initGame();

function update() {
  if (document.querySelector('.modal[style*="display: flex"]')) return;

  // ส่งขนาด WORLD ไปเช็กขอบเขตแมพแทน canvas
  player.update(WORLD_WIDTH, WORLD_HEIGHT);

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

  // 💡 4. คำนวณ Camera Offset ให้เลื่อนตามตัวละครให้อยู่กลางจอเสมอ
  let cameraX = player.x - canvas.width / 2;
  let cameraY = player.y - canvas.height / 2;

  // บล็อกกล้องไม่ให้หลุดขอบแมพใหญ่
  cameraX = Math.max(0, Math.min(cameraX, WORLD_WIDTH - canvas.width));
  cameraY = Math.max(0, Math.min(cameraY, WORLD_HEIGHT - canvas.height));

  ctx.save();
  // เลื่อนพิกเซลการวาดตามตำแหน่งกล้อง
  ctx.translate(-cameraX, -cameraY);

  // วาดพื้นหลัง/เส้นตารางของแมพ (ช่วยให้เห็นชัดว่าแมพกว้างขึ้น)
  drawMapGrid();

  // วาดลูกบอลคำถาม
  balls.forEach(ball => {
    ball.draw(ctx);
  });

  // วาดตัวละคร
  player.draw(ctx);

  ctx.restore();
}

// วาดเส้น Grid พื้นหลังแมพ
function drawMapGrid() {
  const gridSize = 100;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;

  for (let x = 0; x <= WORLD_WIDTH; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= WORLD_HEIGHT; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD_WIDTH, y);
    ctx.stroke();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();