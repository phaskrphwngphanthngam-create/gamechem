let score = 0;
let answeredCount = 0;
let currentQuestionIndex = -1;

// 1. เปิดหน้าคำถาม
function openQuiz(index) {
  currentQuestionIndex = index;
  // 💡 ดึงข้อสอบจาก currentQuestions (ชุด 10 ข้อที่สุ่มมา)
  const q = currentQuestions[index];
  
  // ตั้งค่าสถานการณ์
  document.getElementById('scenarioText').innerText = q.scenario;
  
  // รีเซ็ตกล่องคำใบ้ให้อยู่ในสถานะ "ปิด" ก่อนเสมอ
  const hintBox = document.getElementById('hintBox');
  hintBox.style.display = 'none';
  hintBox.innerText = `💡 คำใบ้: ${q.hint || "ไม่มีคำใบ้สำหรับข้อนี้"}`;

  // สร้างปุ่มตัวเลือก A, B, C, D
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(i);
    container.appendChild(btn);
  });

  document.getElementById('quizModal').style.display = 'flex';
}

// 2. ฟังก์ชันกดเปิด/ปิดคำใบ้
function toggleHint() {
  const hintBox = document.getElementById('hintBox');
  if (hintBox.style.display === 'none') {
    hintBox.style.display = 'block';
  } else {
    hintBox.style.display = 'none';
  }
}

// 3. ตรวจคำตอบ
function checkAnswer(selectedIndex) {
  document.getElementById('quizModal').style.display = 'none';
  // 💡 ดึงข้อสอบจาก currentQuestions
  const q = currentQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === q.answer;

  const title = document.getElementById('resultTitle');
  const detail = document.getElementById('resultDetail');

  if (isCorrect) {
    score += 10;
    title.innerText = "✅ ถูกต้อง!";
    title.style.color = "#16a34a";
    detail.innerText = "+10 คะแนน\nตอบคำถามเกี่ยวกับพอลิเมอร์ได้ถูกต้อง";
  } else {
    title.innerText = "❌ ยังไม่ถูกต้อง";
    title.style.color = "#dc2626";
    detail.innerText = `คำตอบที่ถูกต้องคือ ${q.options[q.answer]}\n💡 คำใบ้: ${q.hint || "ไม่มีคำใบ้สำหรับข้อนี้"}`;
  }

  answeredCount++;
  document.getElementById('resultModal').style.display = 'flex';
}

// 4. ปิดหน้าแจ้งผล และเช็กว่าตอบครบทุกบอลหรือยัง
function closeResult() {
  document.getElementById('resultModal').style.display = 'none';
  if (answeredCount >= balls.length) {
    document.getElementById('finalScore').innerText = `${score} / ${balls.length * 10}`;
    document.getElementById('summaryModal').style.display = 'flex';
  }
}

// 5. รีเซ็ตเกมใหม่ (สุ่มตำแหน่งบอล + คำถามชุดใหม่)
function resetGame() {
  score = 0;
  answeredCount = 0;

  // 💡 ย้ายตัวละครไปวางไว้ตรงกลางของแมพใหญ่
  if (typeof WORLD_WIDTH !== 'undefined' && typeof WORLD_HEIGHT !== 'undefined') {
    player.x = WORLD_WIDTH / 2;
    player.y = WORLD_HEIGHT / 2;
  } else {
    player.x = window.innerWidth / 2;
    player.y = window.innerHeight / 2;
  }

  // 💡 เรียกฟังก์ชันสุ่มคำถามและสุ่มตำแหน่งสร้างจุดบอลใหม่จาก main.js
  if (typeof initGame === 'function') {
    initGame();
  }

  document.getElementById('summaryModal').style.display = 'none';
}