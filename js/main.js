const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 💡 ปรับขนาด Canvas ให้เต็มหน้าจอ
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 💡 ฟังก์ชันสุ่มสลับคำถาม (Fisher-Yates Shuffle)
function getRandomQuestions(allQuestions, count = 10) {
  let shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 💡 กำหนดตำแหน่งสำหรับวางลูกบอล 10 จุดบนหน้าจอ
const ballPositions = [
  { x: 200, y: 150 }, { x: 500, y: 150 }, { x: 800, y: 150 },
  { x: 200, y: 350 }, { x: 500, y: 350 }, { x: 800, y: 350 },
  { x: 200, y: 550 }, { x: 500, y: 550 }, { x: 800, y: 550 },
  { x: 1100, y: 350 }
];

// ตัวแปรเก็บคำถาม 10 ข้อที่ถูกสุ่มเลือกมา
let currentQuestions = [];
let balls = [];

// 💡 ฟังก์ชันเริ่มต้นสร้างจุดบอลคำถาม
function initGame() {
  currentQuestions = getRandomQuestions(questions, 10);
  
  balls = currentQuestions.map((q, index) => {
    // ถ้ามีตำแหน่งกำหนดไว้ให้ใช้ตำแหน่งนั้น ถ้าไม่มีสุ่มตำแหน่งให้อยู่ในหน้าจอ
    let pos = ballPositions[index] || {
      x: Math.random() * (canvas.width - 200) + 100,
      y: Math.random() * (canvas.height - 200) + 100
    };
    return new CheckBall(pos.x, pos.y, index);
  });
}

// สร้างผู้เล่นไว้กลางจอ
const player = new Player(window.innerWidth / 2, window.innerHeight / 2);

// เรียกสร้างบอลคำถามครั้งแรก
initGame();

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