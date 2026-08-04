// 💡 ไม่ใช้ let score เพื่อป้องกัน SyntaxError จากการประกาศซ้ำกับ main.js
score = typeof score !== 'undefined' ? score : 0;
answeredCount = typeof answeredCount !== 'undefined' ? answeredCount : 0;
let currentQuestionIndex = -1;

// 1. เปิดหน้าคำถาม
function openQuiz(index) {
  currentQuestionIndex = index;
  const q = currentQuestions[index];
  
  // ตั้งค่าสถานการณ์ข้อความคำถาม
  let scenarioHTML = q.scenario;
  
  // 🖼️ แสดงรูปภาพประจำข้อในตัวคำถามหลัก (ถ้ามี q.image)
  if (q.image) {
    scenarioHTML += `<br><img src="${q.image}" alt="รูปประกอบคำถาม" class="scenario-image">`;
  }
  document.getElementById('scenarioText').innerHTML = scenarioHTML;
  
  // รีเซ็ตกล่องคำใบ้ให้อยู่ในสถานะ "ปิด" ก่อนเสมอ
  const hintBox = document.getElementById('hintBox');
  hintBox.style.display = 'none';
  
  // 💡 สร้างเนื้อหาคำใบ้ (ข้อความ + รูปภาพคำใบ้ q.hintImage ถ้ามี)
  let hintContent = `💡 คำใบ้: ${q.hint || "ไม่มีคำใบ้สำหรับข้อนี้"}`;
  if (q.hintImage) {
    hintContent += `<br><img src="${q.hintImage}" alt="คำใบ้" class="hint-image">`;
  }
  hintBox.innerHTML = hintContent;

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
  
  const q = currentQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === q.answer;

  const title = document.getElementById('resultTitle');
  const detail = document.getElementById('resultDetail');

  if (isCorrect) {
    score += 10;
    title.innerText = "✅ ถูกต้อง!";
    title.style.color = "#16a34a";
    detail.innerHTML = "+10 คะแนน<br>ตอบคำถามเกี่ยวกับพอลิเมอร์ได้ถูกต้อง";
  } else {
    title.innerText = "❌ ยังไม่ถูกต้อง";
    title.style.color = "#dc2626";
    
    let wrongContent = `คำตอบที่ถูกต้องคือ: ${q.options[q.answer]}<br>💡 คำใบ้: ${q.hint || "ไม่มีคำใบ้สำหรับข้อนี้"}`;
    if (q.hintImage) {
      wrongContent += `<br><img src="${q.hintImage}" alt="คำใบ้" class="result-image">`;
    } else if (q.image) {
      wrongContent += `<br><img src="${q.image}" alt="รูปประกอบ" class="result-image">`;
    }
    detail.innerHTML = wrongContent;
  }

  answeredCount++;
  
  // อัปเดต UI บน HUD ด้านบน
  const scoreTextElem = document.getElementById('score-text');
  const progressTextElem = document.getElementById('progress-text');
  if (scoreTextElem) scoreTextElem.innerText = score;
  if (progressTextElem) progressTextElem.innerText = `${answeredCount} / ${typeof balls !== 'undefined' ? balls.length : 20}`;

  document.getElementById('resultModal').style.display = 'flex';
}

// 4. ปิดหน้าแจ้งผล และเช็กว่าตอบครบทุกบอลหรือยัง
function closeResult() {
  document.getElementById('resultModal').style.display = 'none';
  
  const totalBalls = typeof balls !== 'undefined' ? balls.length : 20;

  if (answeredCount >= totalBalls) {
    if (typeof stopTimer === 'function') {
      stopTimer();
    }

    const timerElem = document.getElementById('timer-text');
    const timeTaken = timerElem ? timerElem.innerText : "00:00";
    
    const finalScoreElem = document.getElementById('finalScore');
    if (finalScoreElem) {
      finalScoreElem.innerText = `${score} / ${totalBalls * 10} คะแนน (เวลา: ${timeTaken})`;
    }
    
    document.getElementById('summaryModal').style.display = 'flex';
  }
}

// 5. บันทึกคะแนนลง LocalStorage สำหรับระบบ Leaderboard
function submitScore() {
  const nameInput = document.getElementById("playerNameInput");
  const name = nameInput ? nameInput.value.trim() || "ผู้เล่นไร้นาม" : "ผู้เล่นไร้นาม";
  const timerElem = document.getElementById("timer-text");
  const timeTaken = timerElem ? timerElem.innerText : "00:00";

  const newEntry = {
    name: name,
    score: score,
    time: timeTaken,
    rawTime: typeof secondsElapsed !== 'undefined' ? secondsElapsed : 0,
    date: new Date().toLocaleDateString("th-TH")
  };

  let leaderboard = JSON.parse(localStorage.getItem("polymer_leaderboard") || "[]");
  leaderboard.push(newEntry);

  leaderboard.sort((a, b) => b.score - a.score || a.rawTime - b.rawTime);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem("polymer_leaderboard", JSON.stringify(leaderboard));

  if (nameInput) nameInput.value = "";
  document.getElementById("summaryModal").style.display = "none";
  
  showLeaderboard();
}

// 6. แสดงตาราง Leaderboard
function showLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("polymer_leaderboard") || "[]");
  const listContainer = document.getElementById("leaderboardList");
  
  if (listContainer) {
    listContainer.innerHTML = "";
    if (leaderboard.length === 0) {
      listContainer.innerHTML = "<p style='text-align: center; color: #94a3b8;'>ยังไม่มีข้อมูลอันดับ</p>";
    } else {
      leaderboard.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "leaderboard-item";
        row.innerHTML = `
          <span>#${index + 1} <strong>${item.name}</strong></span>
          <span>${item.score} คะแนน (${item.time})</span>
        `;
        listContainer.appendChild(row);
      });
    }
  }

  const leaderboardModal = document.getElementById("leaderboardModal");
  if (leaderboardModal) leaderboardModal.style.display = "flex";
}

// 7. ปิดตาราง Leaderboard แล้วรีเซ็ตเกม
function closeLeaderboard() {
  const leaderboardModal = document.getElementById("leaderboardModal");
  if (leaderboardModal) leaderboardModal.style.display = "none";
  resetGame();
}

// 8. รีเซ็ตเกมใหม่
function resetGame() {
  score = 0;
  answeredCount = 0;

  const scoreTextElem = document.getElementById('score-text');
  const progressTextElem = document.getElementById('progress-text');
  const timerElem = document.getElementById('timer-text');
  if (scoreTextElem) scoreTextElem.innerText = score;
  if (progressTextElem) progressTextElem.innerText = `0 / ${typeof totalQuestions !== 'undefined' ? totalQuestions : 20}`;
  if (timerElem) timerElem.innerText = "00:00";

  if (typeof player !== 'undefined') {
    if (typeof WORLD_WIDTH !== 'undefined' && typeof WORLD_HEIGHT !== 'undefined') {
      player.x = WORLD_WIDTH / 2;
      player.y = WORLD_HEIGHT / 2 - 280;
    } else {
      player.x = window.innerWidth / 2;
      player.y = window.innerHeight / 2;
    }
  }

  if (typeof initGame === 'function') {
    initGame();
  }

  const summaryModal = document.getElementById('summaryModal');
  if (summaryModal) summaryModal.style.display = 'none';
}