let score = 0;
let answeredCount = 0;
let currentQuestionIndex = -1;

function openQuiz(index) {
  currentQuestionIndex = index;
  const q = questions[index];
  document.getElementById('scenarioText').innerText = q.scenario;
  
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

function checkAnswer(selectedIndex) {
  document.getElementById('quizModal').style.display = 'none';
  const q = questions[currentQuestionIndex];
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
    detail.innerText = `คำตอบที่ถูกต้องคือ ${q.options[q.answer]}\n💡 คำใบ้: ${q.hint}`;
  }

  answeredCount++;
  document.getElementById('resultModal').style.display = 'flex';
}

function closeResult() {
  document.getElementById('resultModal').style.display = 'none';
  if (answeredCount >= balls.length) {
    document.getElementById('finalScore').innerText = `${score} / ${balls.length * 10}`;
    document.getElementById('summaryModal').style.display = 'flex';
  }
}

function resetGame() {
  score = 0;
  answeredCount = 0;
  player.x = 400;
  player.y = 300;
  balls.forEach(b => b.active = true);
  document.getElementById('summaryModal').style.display = 'none';
}