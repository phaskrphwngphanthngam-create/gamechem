// 🔴 ตั้งค่า Firebase (เอาค่าจาก Firebase Console ของคุณมาใส่ตรงนี้)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "123456789",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentPlayerName = "";

// ข้อมูลเนื้อเรื่อง
const storyData = {
    1: {
        text: "คุณติดฝนหนักอยู่หน้าคฤหาสน์ร้างแห่งหนึ่ง ประตูด้านหน้าเปิดแย้มไว้เล็กน้อย แต่มุมตึกด้านขวามีแสงไฟสลัวๆ จากหน้าต่างชั้นล่าง คุณจะทำอย่างไร?",
        choices: [
            { text: "🚪 เดินเข้าประตูหน้าไปตรงๆ", nextNode: 2 },
            { text: "🔍 เดินอ้อมไปดูตรงหน้าต่างที่มีแสงไฟ", nextNode: 3 }
        ]
    },
    2: {
        text: "คุณผลักประตูหน้าเข้าไป เสียงดัง 'เอี๊ยด...' ประตูปิดล็อคตัวเองทันที! ข้างในมืดสนิท แต่มุมห้องมีหีบไม้เก่าๆ วางอยู่",
        choices: [
            { text: "📦 ลองเปิดหีบไม้ดู", nextNode: 4 },
            { text: "🚶‍♂️ พยายามหากุญแจเพื่อเปิดประตูกลับออกไป", nextNode: 5 }
        ]
    },
    3: {
        text: "คุณแอบมองผ่านหน้าต่าง เห็นชายแก่คนหนึ่งกำลังนั่งอ่านหนังสือโบราณ ทันใดนั้นเขาก็หันหน้ามามองคุณพอดี!",
        choices: [
            { text: "🏃‍♂️ รีบวิ่งหนีออกไปที่ถนนใหญ่", nextNode: 6 },
            { text: "👋 เคาะกระจกเพื่อขอความช่วยเหลือ", nextNode: 7 }
        ]
    },
    // ฉากจบ (isEnding: true)
    4: { text: "คุณเปิดหีบออก... มันคือหีบสมบัติทองคำ! 🎉 คุณกลายเป็นมหาเศรษฐี!", isEnding: true, endingTitle: "🏆 สมบัติมหาศาล" },
    5: { text: "คุณตกสไลเดอร์ลับลงไปในคุกใต้ดิน... ติดอยู่ในนั้นตลอดกาล 💀", isEnding: true, endingTitle: "💀 ติดในคุกใต้ดิน" },
    6: { text: "คุณวิ่งหนีแล้วเจอรถแท็กซี่รับกลับบ้านปลอดภัย 🚕", isEnding: true, endingTitle: "🚕 หนีรอดปลอดภัย" },
    7: { text: "ชายแก่ชงชาอุ่นๆ ให้ดื่ม เขาคือเจ้าของบ้านที่ใจดีมากๆ ☕", isEnding: true, endingTitle: "☕ ชาอุ่นหลบฝน" }
};

// ฟังก์ชันระบบ Login
function startGame() {
    const input = document.getElementById('username-input').value.trim();
    if (!input) {
        alert("กรุณากรอกชื่อก่อนเริ่มเล่นครับ!");
        return;
    }
    
    currentPlayerName = input;
    document.getElementById('player-display').innerText = currentPlayerName;

    // สลับหน้าจอ
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    goToStoryNode(1);
}

// ฟังก์ชันเล่นเกม
function goToStoryNode(nodeId) {
    const node = storyData[nodeId];
    
    document.getElementById('story-text').innerText = node.text;
    const choicesBox = document.getElementById('choice-buttons');
    choicesBox.innerHTML = '';

    if (node.isEnding) {
        // บันทึกคะแนนลง Firebase
        saveScore(currentPlayerName, node.endingTitle);
        showScoreboard(node.endingTitle);
        return;
    }

    node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice.text;
        btn.onclick = () => goToStoryNode(choice.nextNode);
        choicesBox.appendChild(btn);
    });
}

// บันทึกผลลง Firebase
function saveScore(name, ending) {
    const scoresRef = database.ref('scores');
    scoresRef.push({
        name: name,
        ending: ending,
        timestamp: Date.now()
    });
}

// แสดงหน้า Scoreboard และดึงข้อมูลแบบ Realtime
function showScoreboard(endingTitle) {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('score-screen').classList.remove('hidden');
    document.getElementById('final-result').innerText = `ฉากจบของคุณ: ${endingTitle}`;

    // ดึงข้อมูลเรียลไทม์ (จำกัด 10 รายการล่าสุด)
    database.ref('scores').limitToLast(10).on('value', (snapshot) => {
        const scoreList = document.getElementById('score-list');
        scoreList.innerHTML = '';

        const data = snapshot.val();
        if (data) {
            // แปลงเป็น Array แล้วรีเวิร์สเอาอันล่าสุดขึ้นก่อน
            const scoresArray = Object.values(data).reverse();
            
            scoresArray.forEach((item, index) => {
                const row = document.createElement('div');
                row.className = 'score-row';
                row.innerHTML = `
                    <span>#${index + 1} ${item.name}</span>
                    <span>${item.ending}</span>
                `;
                scoreList.appendChild(row);
            });
        }
    });
}

function restartGame() {
    document.getElementById('score-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('username-input').value = '';
}