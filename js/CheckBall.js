class CheckBall {
  constructor(x, y, qIndex) {
    this.x = x;
    this.y = y;
    this.qIndex = qIndex;
    this.active = true;
    this.floatOffset = Math.random() * Math.PI * 2; // สุ่มจังหวะการลอย
    this.sprite = this.generateBallSprite();
  }

  // 🎨 วาดสไปรต์ลูกบอลคำถามความละเอียดสูง 32x32 Pixel
  generateBallSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    const pSize = 1.5; // พิกเซลละ 1.5px (32 * 1.5 = 48px)

    const C = {
      'G1': 'rgba(236, 72, 153, 0.3)', // ออร่าเรืองแสงชมพู
      'B1': '#831843', // ขอบเงาเข้ม
      'B2': '#be185d', // เนื้อบอลสีเข้ม
      'B3': '#db2777', // สีหลัก
      'B4': '#f43f5e', // สว่าง
      'B5': '#fb7185', // ไฮไลต์
      'W':  '#ffffff', // ประกายดาว/แสงสะท้อน
      'S':  'rgba(0, 0, 0, 0.2)', // เงาพื้น
      '.': null
    };

    // ผังพิกเซล 32x32 บอลเวทมนตร์/คำถาม
    const map = Array(32).fill(null).map(() => Array(32).fill('.'));

    // วาดทรงกลม 32x32 (รัศมีประมาณ 11 พิกเซล ตรงกลาง 16,16)
    const centerX = 16, centerY = 16, radius = 10;
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const dist = Math.hypot(x - centerX, y - centerY);
        if (dist <= radius + 3 && dist > radius) {
          map[y][x] = 'G1'; // ออร่านอก
        } else if (dist <= radius) {
          if (x < 13 && y < 13) map[y][x] = 'B5';      // ไฮไลต์ซ้ายบน
          else if (x > 20 || y > 20) map[y][x] = 'B1'; // เงารอบขวาใต้
          else if (x > 17 || y > 17) map[y][x] = 'B2';
          else map[y][x] = 'B3';                       // สีหลัก
        }
      }
    }

    // ใส่แสงสะท้อนดาว 4 แฉกตรงกลางบอล (เครื่องหมาย ? หรือ ประกาย)
    map[10][10] = 'W'; map[10][11] = 'W';
    map[11][10] = 'W'; map[12][12] = 'B5';

    // วาดสัญลักษณ์เครื่องหมายคำถาม (?) กลางบอล
    const qMap = [
      [12,15],[12,16],[12,17],
      [13,14],[13,18],
      [14,18],
      [15,17],
      [16,16],
      [18,16] // จุดใต้คำถาม
    ];
    qMap.forEach(([y, x]) => map[y][x] = 'W');

    // สั่งเรนเดอร์ลง Canvas จำลอง
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

    // 🎈 คำนวณระยะการลอยขึ้น-ลง (Floating Effect)
    this.floatOffset += 0.05;
    const hoverY = Math.sin(this.floatOffset) * 6;

    // 1. วาดเงาลูกบอลบนพื้น (ขยับตามการลอย)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 18, 16 - hoverY * 0.5, 6 - hoverY * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. วาดตัวลูกบอล 32x32
    ctx.drawImage(this.sprite, this.x - 24, this.y - 24 + hoverY);
  }
}