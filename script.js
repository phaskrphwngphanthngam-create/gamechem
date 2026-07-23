// แผนผังเนื้อเรื่อง (Story Graph)
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
    // ฉากจบ
    4: {
        text: "คุณเปิดหีบออก... มันคือหีบสมบัติที่ข้างในมีทองคำเปล่งประกาย! คุณรอดชีวิตและกลายเป็นมหาเศรษฐี! 🎉 (Ending 1/4)",
        choices: [{ text: "🔄 เล่นใหม่อีกครั้ง", nextNode: 1 }]
    },
    5: {
        text: "คุณคลำหาทางในความมืดแล้วก้าวพลาดตกสไลเดอร์ลับลงไปในคุกใต้ดิน... คุณติดอยู่ในนั้นตลอดกาล 💀 (Ending 2/4)",
        choices: [{ text: "🔄 ลองใหม่อีกครั้ง", nextNode: 1 }]
    },
    6: {
        text: "คุณวิ่งลื่นสะดุดโคลนหน้าคฤหาสน์ แต่โชคดีที่มีรถแท็กซี่ขับผ่านมารับพอดี คุณรอดกลับบ้านได้อย่างปลอดภัย 🚕 (Ending 3/4)",
        choices: [{ text: "🔄 เล่นใหม่อีกครั้ง", nextNode: 1 }]
    },
    7: {
        text: "ชายแก่เดินมาเปิดประตู ยิ้มอย่างต้อนรับ แล้วชงชาอุ่นๆ ให้คุณดื่มเพื่อหลบฝน เขาคือคุณตาเจ้าของบ้านที่ใจดีมากๆ ☕ (Ending 4/4)",
        choices: [{ text: "🔄 เล่นใหม่อีกครั้ง", nextNode: 1 }]
    }
};

// ดึง Element จาก HTML
const storyTextNode = document.getElementById('story-text');
const choicesContainer = document.getElementById('choice-buttons');

// ฟังก์ชันสำหรับเปลี่ยนเนื้อเรื่องตาม node
function goToStoryNode(nodeId) {
    const currentNode = storyData[nodeId];
    
    // อัปเดตข้อความเนื้อเรื่อง
    storyTextNode.innerText = currentNode.text;

    // เคลียร์ปุ่มเก่าออกก่อน
    choicesContainer.innerHTML = '';

    // สร้างปุ่มใหม่ตามทางเลือก
    currentNode.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice.text;
        btn.onclick = () => goToStoryNode(choice.nextNode);
        choicesContainer.appendChild(btn);
    });
}

// เริ่มต้นเกมที่ Node แรก
goToStoryNode(1);