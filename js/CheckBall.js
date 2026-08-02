class CheckBall {
  constructor(x, y, qIndex) {
    this.x = x;
    this.y = y;
    this.qIndex = qIndex;
    this.active = true;
    this.floatOffset = Math.random() * Math.PI * 2; // สุ่มจังหวะลอย
    this.sprite = this.generateBallSprite();
  }

  // 🎨 วาดสไปรต์ลูกบอลขาวดำ 32x32 Pixel Art
  generateBallSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    const pSize = 1.5; // พิกเซลละ 1.5px

    const C = {
      'B': '#0f172a', // ดำเงา
      'D': '#334155', // เทาเข้ม
      'G': '#94a3b8', // เทากลาง
      'W': '#ffffff', // ขาว
      'H': '#f8fafc', // ขาวไฮไลต์
      'S': 'rgba(0, 0, 0, 0.2)', // เงา
      '.': null
    };

    const map = Array(32).fill(null).map(() => Array(32).fill('.'));
    const centerX = 16, centerY = 16, radius = 10;

    // ⚽ 1. วาดโครงทรงกลมลูกบอล
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const dist = Math.hypot(x - centerX, y - centerY);
        if (dist <= radius) {
          map[y][x] = 'W'; // พื้นฐานสีขาว
        }
      }
    }

    // ⚽ 2. ใส่ลายหกเหลี่ยมสีดำสไตล์ลูกบอลขาวดำ
    // ลายตรงกลาง
    const centerPattern = [
      [14,15],[14,16],[14,17],
      [15,14],[15,15],[15,16],[15,17],[15,18],
      [16,14],[16,15],[16,16],[16,17],[16,18],
      [17,15],[17,16],[17,17]
    ];
    centerPattern.forEach(([y, x]) => map[y][x] = 'B');

    // ลายขอบซ้ายบน
    [[8,10],[9,9],[9,10],[10,8],[10,9],[11,8]].forEach(([y, x]) => map[y][x] = 'B');
    // ลายขอบขวาบน
    [[8,21],[9,21],[9,22],[10,22],[10,23],[11,23]].forEach(([y, x]) => map[y][x] = 'B');
    // ลายขอบซ้ายล่าง
    [[21,8],[21,9],[22,9],[22,10],[23,10]].forEach(([y, x]) => map[y][x] = 'B');
    // ลายขอบขวาล่าง
    [[21,23],[21,22],[22,22],[22,21],[23,21]].forEach(([y, x]) => map[y][x] = 'B');

    // ⚽ 3. ใส่เงาและไฮไลต์ทรงกลม
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const dist = Math.hypot(x - centerX, y - centerY);
        if (dist <= radius) {
          if (x <= 11 && y <= 11 && map[y][x] === 'W') map[y][x] = 'H'; // ไฮไลต์
          if (x >= 20 || y >= 20) {
            if (map[y][x] === 'W') map[y][x] = 'G'; // เงาบนสีขาว
            if (map[y][x] === 'B') map[y][x] = 'D'; // เงาบนสีดำ
          }
        }
      }
    }

    // เรนเดอร์ลง Canvas
    map.forEach((row, y) => {
      row.forEach((colorKey, x) => {
        if (colorKey && C[colorKey]) {
          ctx.fillStyle = C[colorKey];
          ctx.fillRect(x * pSize, y * pSize, pSize, pSize);
        }
      });
    });

    return canvas;
  }

  draw(ctx) {
    if (!this.active) return;

    // 🎈 ระยะการลอยขึ้น-ลง (Floating Animation)
    this.floatOffset += 0.05;
    const hoverY = Math.sin(this.floatOffset) * 6;

    // 1. เงาลูกบอลบนพื้น
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 18, 16 - hoverY * 0.4, 6 - hoverY * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. ตัวลูกบอลขาวดำ 32x32
    ctx.drawImage(this.sprite, this.x - 24, this.y - 24 + hoverY);

    // 🟡 3. วาดลูกศรสีเหลืองชี้ลง (Floating Yellow Arrow)
    const arrowY = this.y - 42 + hoverY; // ลอยเหนือบอล
    ctx.save();
    
    // เงาออร่าเรืองแสงสีเหลือง
    ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, arrowY - 2, 14, 0, Math.PI * 2);
    ctx.fill();

    // วาดรูปทรงลูกศรสีเหลืองชี้ลง
    ctx.fillStyle = '#facc15'; // สีเหลืองสว่าง
    ctx.strokeStyle = '#854d0e'; // ขอบน้ำตาลเข้ม
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.x - 10, arrowY - 12);
    ctx.lineTo(this.x + 10, arrowY - 12);
    ctx.lineTo(this.x + 10, arrowY - 4);
    ctx.lineTo(this.x + 16, arrowY - 4);
    ctx.lineTo(this.x, arrowY + 10);      // หัวลูกศรชี้ลง
    ctx.lineTo(this.x - 16, arrowY - 4);
    ctx.lineTo(this.x - 10, arrowY - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}