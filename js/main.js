const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 💡 1. ขนาดแมพสวนสาธารณะ (World Bounds)
const WORLD_WIDTH = 2500;  
const WORLD_HEIGHT = 2000; 

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getRandomQuestions(allQuestions, count = 10) {
  let shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 🌳 ข้อมูลตำแหน่งสิ่งตกแต่ง 32x32 บนแมพ
const parkElements = {
  trees: [
    {x: 250, y: 300}, {x: 420, y: 250}, {x: 1800, y: 250}, {x: 2020, y: 350},
    {x: 300, y: 1500}, {x: 480, y: 1650}, {x: 2100, y: 1400}, {x: 2280, y: 1600},
    {x: 1000, y: 300}, {x: 1500, y: 300}, {x: 1000, y: 1700}, {x: 1500, y: 1700},
    {x: 750, y: 850}, {x: 1750, y: 1150}
  ],
  benches: [
    {x: 700, y: 920}, {x: 1800, y: 920}, {x: 700, y: 1080}, {x: 1800, y: 1080}
  ],
  lamps: [
    {x: 600, y: 600}, {x: 1900, y: 600}, {x: 600, y: 1400}, {x: 1900, y: 1400}
  ],
  flowers: [
    {x: 350, y: 500, c: '#f43f5e'}, {x: 380, y: 530, c: '#ec4899'}, {x: 320, y: 540, c: '#eab308'},
    {x: 2100, y: 500, c: '#a855f7'}, {x: 2150, y: 520, c: '#f43f5e'},
    {x: 400, y: 1350, c: '#eab308'}, {x: 430, y: 1380, c: '#ec4899'},
    {x: 2000, y: 1250, c: '#f43f5e'}, {x: 2050, y: 1280, c: '#a855f7'}
  ],
  lilyPads: [
    {x: WORLD_WIDTH/2 - 90, y: WORLD_HEIGHT/2 - 60},
    {x: WORLD_WIDTH/2 + 70, y: WORLD_HEIGHT/2 + 80},
    {x: WORLD_WIDTH/2 - 50, y: WORLD_HEIGHT/2 + 110}
  ]
};

// 💡 2. สุ่มตำแหน่งลูกบอลทั่วแมพ
function generateRandomPositions(count, minDistance = 220, padding = 200) {
  const positions = [];
  let attempts = 0;

  while (positions.length < count && attempts < 1000) {
    attempts++;
    const newPos = {
      x: Math.floor(Math.random() * (WORLD_WIDTH - padding * 2)) + padding,
      y: Math.floor(Math.random() * (WORLD_HEIGHT - padding * 2)) + padding
    };

    const isTooClose = positions.some(pos => Math.hypot(pos.x - newPos.x, pos.y - newPos.y) < minDistance);
    const isNearCenter = Math.hypot(newPos.x - WORLD_WIDTH / 2, newPos.y - WORLD_HEIGHT / 2) < 250;
    const isInsidePond = Math.hypot(newPos.x - WORLD_WIDTH / 2, newPos.y - WORLD_HEIGHT / 2) < 260;

    if (!isTooClose && !isNearCenter && !isInsidePond) {
      positions.push(newPos);
    }
  }
  return positions;
}

let currentQuestions = [];
let balls = [];

function initGame() {
  currentQuestions = getRandomQuestions(questions, 10);
  const randomPositions = generateRandomPositions(currentQuestions.length);

  balls = currentQuestions.map((q, index) => {
    return new CheckBall(randomPositions[index].x, randomPositions[index].y, index);
  });
}

const player = new Player(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
initGame();

function update() {
  if (document.querySelector('.modal[style*="display: flex"]')) return;

  player.update(WORLD_WIDTH, WORLD_HEIGHT);

  balls.forEach(ball => {
    if (ball.active) {
      let dist = Math.hypot(player.x - ball.x, player.y - ball.y);
      if (dist < player.size + 18) {
        ball.active = false;
        openQuiz(ball.qIndex);
      }
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let cameraX = player.x - canvas.width / 2;
  let cameraY = player.y - canvas.height / 2;

  cameraX = Math.max(0, Math.min(cameraX, WORLD_WIDTH - canvas.width));
  cameraY = Math.max(0, Math.min(cameraY, WORLD_HEIGHT - canvas.height));

  ctx.save();
  ctx.translate(-cameraX, -cameraY);

  // 1. วาดพื้นหลังแมพ
  drawParkGround();

  // 2. วาดลูกบอลคำถาม
  balls.forEach(ball => ball.draw(ctx));

  // 3. วาดวัตถุ + ตัวละคร พร้อมระบบ Y-Sorting และเงาวัตถุ
  drawParkObjectsAndPlayer();

  // 4. ☀️ วาดเลเยอร์แสงนวลบรรยากาศ (Ambient Lighting Overlay)
  drawLightingOverlay();

  ctx.restore();
}

// 🏞️ วาดพื้นหลังสวนสาธารณะ
function drawParkGround() {
  const centerX = WORLD_WIDTH / 2;
  const centerY = WORLD_HEIGHT / 2;

  // พื้นหญ้า
  ctx.fillStyle = '#86efac';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // กอหญ้า
  ctx.fillStyle = '#4ade80';
  for (let x = 80; x < WORLD_WIDTH; x += 180) {
    for (let y = 80; y < WORLD_HEIGHT; y += 180) {
      ctx.fillRect(x, y, 4, 12);
      ctx.fillRect(x - 4, y + 4, 4, 8);
      ctx.fillRect(x + 4, y + 2, 4, 10);
    }
  }

  // ทางเดินอิฐ
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 50;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(centerX, 100); ctx.lineTo(centerX, WORLD_HEIGHT - 100);
  ctx.moveTo(100, centerY); ctx.lineTo(WORLD_WIDTH - 100, centerY);
  ctx.stroke();

  // ลายบล็อกอิฐ
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2;
  for (let y = 120; y < WORLD_HEIGHT - 100; y += 40) {
    ctx.beginPath(); ctx.moveTo(centerX - 20, y); ctx.lineTo(centerX + 20, y); ctx.stroke();
  }

  // บ่อน้ำ
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath(); ctx.arc(centerX, centerY, 240, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath(); ctx.arc(centerX, centerY, 220, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.arc(centerX - 20, centerY - 20, 180, 0, Math.PI * 2); ctx.fill();

  // ประกายน้ำ
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(centerX - 80, centerY - 80, 40, 8);
  ctx.fillRect(centerX + 40, centerY + 30, 60, 8);

  // ใบบัว
  parkElements.lilyPads.forEach(pad => {
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.arc(pad.x, pad.y, 18, 0, Math.PI * 1.8); ctx.fill();
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(pad.x - 3, pad.y - 3, 6, 6);
  });

  // สะพานไม้
  ctx.fillStyle = '#78350f';
  ctx.fillRect(centerX - 40, centerY - 225, 80, 55);
  ctx.fillRect(centerX - 40, centerY + 170, 80, 55);
  ctx.fillStyle = '#451a03';
  for (let i = -220; i <= -175; i += 12) ctx.fillRect(centerX - 40, centerY + i, 80, 3);
  for (let i = 175; i <= 220; i += 12) ctx.fillRect(centerX - 40, centerY + i, 80, 3);

  // ดอกไม้
  parkElements.flowers.forEach(f => {
    ctx.fillStyle = f.c;
    ctx.fillRect(f.x, f.y, 10, 10);
    ctx.fillRect(f.x - 4, f.y + 4, 18, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(f.x + 3, f.y + 3, 4, 4);
  });

  // เสาไฟสวน
  parkElements.lamps.forEach(l => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(l.x - 4, l.y - 20, 8, 35);
    ctx.fillRect(l.x - 10, l.y + 10, 20, 5);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(l.x - 8, l.y - 30, 16, 12);
  });

  // รั้วรอบสวน
  ctx.strokeStyle = '#854d0e';
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, WORLD_WIDTH - 16, WORLD_HEIGHT - 16);
}

// 🌲 วาดวัตถุ + เงาทอดทแยงตามทิศทางแสงแดด
function drawParkObjectsAndPlayer() {
  const drawables = [];

  // เงาตัวละคร
  drawables.push({
    y: player.y,
    draw: () => {
      // เงาแดดทอดเฉียงของตัวละคร
      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.beginPath();
      ctx.ellipse(player.x + 6, player.y + 20, 18, 8, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      player.draw(ctx);
    }
  });

  // ม้านั่ง + เงา
  parkElements.benches.forEach(b => {
    drawables.push({
      y: b.y,
      draw: () => {
        // เงาทอดทแยงของม้านั่ง
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.beginPath();
        ctx.ellipse(b.x + 10, b.y + 16, 36, 10, -Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();

        // ตัวม้านั่ง
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(b.x - 28, b.y - 5, 8, 20);
        ctx.fillRect(b.x + 20, b.y - 5, 8, 20);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(b.x - 32, b.y - 8, 64, 10);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(b.x - 32, b.y - 18, 64, 8);
      }
    });
  });

  // ต้นไม้ + เงาทอดใหญ่
  parkElements.trees.forEach(t => {
    drawables.push({
      y: t.y + 35,
      draw: () => {
        // ☀️ เงาต้นไม้ใหญ่ทอดเฉียงตามแสงแดด
        ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
        ctx.beginPath();
        ctx.ellipse(t.x + 25, t.y + 38, 55, 22, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // ลำต้น
        ctx.fillStyle = '#78350f';
        ctx.fillRect(t.x - 12, t.y, 24, 42);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(t.x + 4, t.y, 8, 42);

        // พุ่มใบไม้ (มีการเน้นไฮไลต์ซ้ายบนตามทิศทางแสง)
        ctx.fillStyle = '#14532d'; // เงาใบ
        ctx.beginPath(); ctx.arc(t.x, t.y - 10, 50, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#15803d'; // ใบกลาง
        ctx.beginPath(); ctx.arc(t.x - 8, t.y - 20, 42, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#22c55e'; // ใบสว่างโดนแดด (ซ้ายบน)
        ctx.beginPath(); ctx.arc(t.x - 16, t.y - 28, 30, 0, Math.PI * 2); ctx.fill();

        // ประกายแสงตกกระทบ
        ctx.fillStyle = '#bbf7d0';
        ctx.fillRect(t.x - 24, t.y - 36, 10, 10);
      }
    });
  });

  drawables.sort((a, b) => a.y - b.y);
  drawables.forEach(item => item.draw());
}

// 💡 🌟 4. ฟังก์ชันสร้างแสงนวลและออร่าเสาไฟ (Dynamic Lighting Overlay)
function drawLightingOverlay() {
  // 1. แสงโทนแดดอุ่นเคลือบทั้งแมพ
  ctx.fillStyle = 'rgba(251, 146, 60, 0.05)'; 
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // 2. รังสีแสงโคมไฟสวนสาธารณะ (Radial Light Gradients)
  parkElements.lamps.forEach(l => {
    const lightGlow = ctx.createRadialGradient(l.x, l.y - 25, 5, l.x, l.y - 25, 90);
    lightGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    lightGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.15)');
    lightGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = lightGlow;
    ctx.beginPath();
    ctx.arc(l.x, l.y - 25, 90, 0, Math.PI * 2);
    ctx.fill();
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();