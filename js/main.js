const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 💡 1. กำหนดขนาดแมพสวนสาธารณะ (World Bounds)
const WORLD_WIDTH = 2500;  
const WORLD_HEIGHT = 2000; 

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 💡 2. ฟังก์ชันสุ่มสลับคำถาม (Fisher-Yates Shuffle)
function getRandomQuestions(allQuestions, count = 10) {
  let shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 🌳 ข้อมูลวัตถุตกแต่งแบบ Fixed พิกเซล (วางตำแหน่งเฉพาะไม่เปลี่ยนตามการรีเฟรช)
const parkElements = {
  trees: [
    {x: 250, y: 300}, {x: 400, y: 250}, {x: 1800, y: 250}, {x: 2000, y: 350},
    {x: 300, y: 1500}, {x: 450, y: 1650}, {x: 2100, y: 1400}, {x: 2250, y: 1600},
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
    {x: 350, y: 500, color: '#f43f5e'}, {x: 380, y: 530, color: '#ec4899'}, {x: 320, y: 540, color: '#eab308'},
    {x: 2100, y: 500, color: '#a855f7'}, {x: 2150, y: 520, color: '#f43f5e'},
    {x: 400, y: 1350, color: '#eab308'}, {x: 430, y: 1380, color: '#ec4899'},
    {x: 2000, y: 1250, color: '#f43f5e'}, {x: 2050, y: 1280, color: '#a855f7'}
  ],
  lilyPads: [
    {x: WORLD_WIDTH/2 - 80, y: WORLD_HEIGHT/2 - 50},
    {x: WORLD_WIDTH/2 + 60, y: WORLD_HEIGHT/2 + 70},
    {x: WORLD_WIDTH/2 - 40, y: WORLD_HEIGHT/2 + 100}
  ]
};

// 💡 3. ฟังก์ชันสุ่มตำแหน่งลูกบอลทั่วแมพ (หลบน้ำ หลบขอบ หลบจุดเกิด)
function generateRandomPositions(count, minDistance = 200, padding = 200) {
  const positions = [];
  let attempts = 0;

  while (positions.length < count && attempts < 1000) {
    attempts++;
    const newPos = {
      x: Math.floor(Math.random() * (WORLD_WIDTH - padding * 2)) + padding,
      y: Math.floor(Math.random() * (WORLD_HEIGHT - padding * 2)) + padding
    };

    // เช็กไม่ให้เกิดใกล้กันเกินไป
    const isTooClose = positions.some(pos => Math.hypot(pos.x - newPos.x, pos.y - newPos.y) < minDistance);
    // เช็กไม่ให้เกิดตรงกลาง (จุดเกิดตัวละคร)
    const isNearCenter = Math.hypot(newPos.x - WORLD_WIDTH / 2, newPos.y - WORLD_HEIGHT / 2) < 250;
    // เช็กไม่ให้ตกน้ำ
    const isInsidePond = Math.hypot(newPos.x - WORLD_WIDTH / 2, newPos.y - WORLD_HEIGHT / 2) < 240;

    if (!isTooClose && !isNearCenter && !isInsidePond) {
      positions.push(newPos);
    }
  }
  return positions;
}

let currentQuestions = [];
let balls = [];

// 💡 4. ฟังก์ชันสร้างบอลแบบสุ่มสลับคำถาม + สุ่มตำแหน่งแมพ
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

  // 💡 5. คำนวณ Camera Offset ให้เลื่อนตามตัวละครให้อยู่กลางจอเสมอ
  let cameraX = player.x - canvas.width / 2;
  let cameraY = player.y - canvas.height / 2;

  // บล็อกกล้องไม่ให้หลุดขอบแมพใหญ่
  cameraX = Math.max(0, Math.min(cameraX, WORLD_WIDTH - canvas.width));
  cameraY = Math.max(0, Math.min(cameraY, WORLD_HEIGHT - canvas.height));

  ctx.save();
  ctx.translate(-cameraX, -cameraY);

  // 🌺 วาดฉากพื้นหลังสวนสาธารณะ (หญ้า, ถนน, สระน้ำ, สะพาน, ดอกไม้)
  drawParkGround();

  // วาดลูกบอลคำถาม
  balls.forEach(ball => {
    ball.draw(ctx);
  });

  // 🌲 วาดสิ่งปลูกสร้างแบบ Y-Sorting (ตัวละครเดินบัง/เดินซ่อนหลังต้นไม้กับม้านั่งได้)
  drawParkObjectsAndPlayer();

  ctx.restore();
}

// 🏞️ 6. วาดฉากพื้นหลังสวนสาธารณะ
function drawParkGround() {
  const centerX = WORLD_WIDTH / 2;
  const centerY = WORLD_HEIGHT / 2;

  // 1. พื้นหญ้านุ่มตา
  ctx.fillStyle = '#86efac';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // 🌿 กอหญ้าเขียวอ่อนกระจายตามพื้น
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 3;
  for (let x = 120; x < WORLD_WIDTH; x += 280) {
    for (let y = 120; y < WORLD_HEIGHT; y += 280) {
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x - 4, y - 8);
      ctx.moveTo(x, y); ctx.lineTo(x + 4, y - 10);
      ctx.stroke();
    }
  }

  // 2. ทางเดินกรวด/ทราย (Paths) ตัดกลางสวน
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 45;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(centerX, 100); ctx.lineTo(centerX, WORLD_HEIGHT - 100);
  ctx.moveTo(100, centerY); ctx.lineTo(WORLD_WIDTH - 100, centerY);
  ctx.stroke();

  // 3. บ่อน้ำ (Pond)
  ctx.fillStyle = '#cbd5e1'; // ขอบหิน
  ctx.beginPath(); ctx.arc(centerX, centerY, 230, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#38bdf8'; // ผิวน้ำ
  ctx.beginPath(); ctx.arc(centerX, centerY, 210, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // ประกายน้ำ
  ctx.beginPath(); ctx.arc(centerX - 50, centerY - 50, 40, 0, Math.PI * 2); ctx.fill();

  // 🪷 ใบบัว floating
  parkElements.lilyPads.forEach(pad => {
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.arc(pad.x, pad.y, 16, 0, Math.PI * 1.8); ctx.fill();
    ctx.fillStyle = '#f43f5e'; // ดอกบัว
    ctx.beginPath(); ctx.arc(pad.x, pad.y, 5, 0, Math.PI * 2); ctx.fill();
  });

  // 🌉 สะพานไม้ข้ามบ่อน้ำ
  ctx.fillStyle = '#78350f';
  ctx.fillRect(centerX - 35, centerY - 215, 70, 50);
  ctx.fillRect(centerX - 35, centerY + 165, 70, 50);
  ctx.fillStyle = '#451a03'; // ราวสะพาน
  ctx.fillRect(centerX - 40, centerY - 215, 8, 50);
  ctx.fillRect(centerX + 32, centerY - 215, 8, 50);
  ctx.fillRect(centerX - 40, centerY + 165, 8, 50);
  ctx.fillRect(centerX + 32, centerY + 165, 8, 50);

  // 🌸 แปลงดอกไม้
  parkElements.flowers.forEach(f => {
    ctx.fillStyle = f.color;
    ctx.beginPath(); ctx.arc(f.x, f.y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(f.x, f.y, 3, 0, Math.PI * 2); ctx.fill();
  });

  // 💡 เสาไฟสวนสาธารณะ
  parkElements.lamps.forEach(l => {
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)'; // แสงออร่า
    ctx.beginPath(); ctx.arc(l.x, l.y - 20, 35, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#334155'; // เสา
    ctx.fillRect(l.x - 4, l.y - 20, 8, 30);
    ctx.fillStyle = '#fef08a'; // หัวโคม
    ctx.beginPath(); ctx.arc(l.x, l.y - 20, 8, 0, Math.PI * 2); ctx.fill();
  });

  // 🪵 รั้วรอบสวน
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, WORLD_WIDTH - 20, WORLD_HEIGHT - 20);
}

// 7. วาดสิ่งของกับตัวละครรวมกันเพื่อจัดลำดับเลเยอร์ (Y-Sorting)
function drawParkObjectsAndPlayer() {
  const drawables = [];

  // ใส่ตัวละคร
  drawables.push({
    y: player.y,
    draw: () => player.draw(ctx)
  });

  // แต่งม้านั่ง
  parkElements.benches.forEach(b => {
    drawables.push({
      y: b.y,
      draw: () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // เงา
        ctx.fillRect(b.x - 28, b.y + 12, 56, 10);
        ctx.fillStyle = '#b45309'; // ที่นั่ง
        ctx.fillRect(b.x - 30, b.y - 10, 60, 20);
        ctx.fillStyle = '#78350f'; // พนักพิง
        ctx.fillRect(b.x - 28, b.y - 15, 56, 6);
      }
    });
  });

  // ใส่ต้นไม้
  parkElements.trees.forEach(t => {
    drawables.push({
      y: t.y + 30, // ใช้จุดโคนต้นไม้เช็ก Y
      draw: () => {
        // เงา
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath(); ctx.ellipse(t.x, t.y + 35, 45, 20, 0, 0, Math.PI * 2); ctx.fill();
        // ลำต้น
        ctx.fillStyle = '#92400e';
        ctx.fillRect(t.x - 10, t.y, 20, 35);
        // ใบไม้ (2 เฉดสี)
        ctx.fillStyle = '#15803d';
        ctx.beginPath(); ctx.arc(t.x, t.y - 10, 45, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath(); ctx.arc(t.x - 12, t.y - 20, 35, 0, Math.PI * 2); ctx.fill();
      }
    });
  });

  // เรียงลำดับตามแกน Y (ของที่อยู่ต่ำกว่าจะถูกวาดทับของที่อยู่สูงกว่า)
  drawables.sort((a, b) => a.y - b.y);

  // สั่งวาดตามลำดับ
  drawables.forEach(item => item.draw());
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();