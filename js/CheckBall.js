class CheckBall {
  constructor(x, y, qIndex) {
    this.x = x;
    this.y = y;
    this.qIndex = qIndex;
    this.active = true;
    this.size = 16;

    // สร้าง Pixel Art ลูกบอลที่มีลูกศรชี้ข้างบน
    this.sprite = this.generatePixelSprite();
  }

  generatePixelSprite() {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 32;
    offCanvas.height = 40; // ความสูงเผื่อไว้ใส่ลูกศรข้างบน
    const offCtx = offCanvas.getContext('2d');
    const pixelSize = 3;

    // จานสี
    const C = {
      'O': '#f97316', // ลูกศรสีส้ม
      'W': '#ffffff', // ตัวลูกบอลสีขาว
      'B': '#000000', // เส้นขอบสีดำ
      'G': '#cbd5e1', // เงาบอลสีเทา
      '.': null
    };

    // ผังพิกเซลลูกศร + ลูกบอล
    const map = [
      ['.','.','.','O','O','.','.','.'], // ลูกศรสีส้มชี้ลง
      ['.','.','O','O','O','O','.','.'],
      ['.','.','.','O','O','.','.','.'],
      ['.','.','.','O','O','.','.','.'],
      ['.','.','.','.','.','.','.','.'], // ช่องว่าง
      ['.','.','B','B','B','B','.','.'], // เริ่มตัวลูกบอล
      ['.','B','W','W','W','G','B','.'],
      ['B','W','W','W','W','G','G','B'],
      ['B','W','W','W','W','G','G','B'],
      ['.','B','W','W','G','G','B','.'],
      ['.','.','B','B','B','B','.','.']
    ];

    map.forEach((row, y) => {
      row.forEach((colorKey, x) => {
        if (colorKey && C[colorKey]) {
          offCtx.fillStyle = C[colorKey];
          offCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      });
    });

    return offCanvas;
  }

  draw(ctx) {
    if (!this.active) return;
    // วาด Pixel Art ลูกบอลคำถาม
    ctx.drawImage(this.sprite, this.x - 12, this.y - 20);
  }
}