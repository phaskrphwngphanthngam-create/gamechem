class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20; // ขนาดตัวละคร
    this.speed = 4;
    this.keys = {};
    
    // ทิศทางปัจจุบัน: 'down', 'up', 'left', 'right'
    this.direction = 'down';

    // วาด Pixel Art ตัวละครเก็บไว้ใน Canvas จำลอง (Offscreen Canvas)
    this.sprites = this.generatePixelSprites();

    window.addEventListener('keydown', e => this.keys[e.key] = true);
    window.addEventListener('keyup', e => this.keys[e.key] = false);
  }

  // สร้าง Pixel Art 8x8 พิกเซล สำหรับ 4 ทิศทาง
  generatePixelSprites() {
    const directions = ['down', 'up', 'left', 'right'];
    const sprites = {};

    // จานสีตัวละคร (Palette)
    const C = {
      'H': '#3b2314', // ผม (น้ำตาลเข้ม)
      'S': '#ffdbac', // ผิว (สีกะปิ/เนื้อ)
      'B': '#2563eb', // เสื้อ (น้ำเงิน)
      'P': '#1e293b', // กางเกง (น้ำเงินเข้ม/ดำ)
      'E': '#000000', // ตา (ดำ)
      '.': null       // พื้นหลังโปร่งใส
    };

    // ผังพิกเซล 8x8 แต่ละทิศทาง
    const maps = {
      down: [
        ['.','H','H','H','H','H','H','.'],
        ['.','H','S','S','S','S','H','.'],
        ['.','S','E','S','S','E','S','.'],
        ['.','S','S','S','S','S','S','.'],
        ['.','B','B','B','B','B','B','.'],
        ['.','B','B','B','B','B','B','.'],
        ['.','P','P','.','.','P','P','.'],
        ['.','P','P','.','.','P','P','.']
      ],
      up: [
        ['.','H','H','H','H','H','H','.'],
        ['.','H','H','H','H','H','H','.'],
        ['.','H','H','H','H','H','H','.'],
        ['.','S','S','S','S','S','S','.'],
        ['.','B','B','B','B','B','B','.'],
        ['.','B','B','B','B','B','B','.'],
        ['.','P','P','.','.','P','P','.'],
        ['.','P','P','.','.','P','P','.']
      ],
      left: [
        ['.','.','H','H','H','H','.','.'],
        ['.','H','H','S','S','S','.','.'],
        ['.','S','E','S','S','S','.','.'],
        ['.','S','S','S','S','S','.','.'],
        ['.','.','B','B','B','B','.','.'],
        ['.','.','B','B','B','B','.','.'],
        ['.','.','P','P','P','.','.','.'],
        ['.','.','P','.','P','.','.','.']
      ],
      right: [
        ['.','.','H','H','H','H','.','.'],
        ['.','.','S','S','S','H','H','.'],
        ['.','.','S','S','S','E','S','.'],
        ['.','.','S','S','S','S','S','.'],
        ['.','.','B','B','B','B','.','.'],
        ['.','.','B','B','B','B','.','.'],
        ['.','.','.','P','P','P','.','.'],
        ['.','.','.','P','.','P','.','.']
      ]
    };

    directions.forEach(dir => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 32;  // ขยายเป็น 32x32px ให้เห็นชัดๆ
      offCanvas.height = 32;
      const offCtx = offCanvas.getContext('2d');
      const pixelSize = 4; // 1 พิกเซลจริง = 4 พิกเซลบนหน้าจอ

      maps[dir].forEach((row, y) => {
        row.forEach((colorKey, x) => {
          if (colorKey && C[colorKey]) {
            offCtx.fillStyle = C[colorKey];
            offCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          }
        });
      });
      sprites[dir] = offCanvas;
    });

    return sprites;
  }

  update(canvasWidth, canvasHeight) {
    if (this.keys['ArrowUp'] || this.keys['w']) {
      if (this.y > this.size) this.y -= this.speed;
      this.direction = 'up';
    } else if (this.keys['ArrowDown'] || this.keys['s']) {
      if (this.y < canvasHeight - this.size) this.y += this.speed;
      this.direction = 'down';
    } else if (this.keys['ArrowLeft'] || this.keys['a']) {
      if (this.x > this.size) this.x -= this.speed;
      this.direction = 'left';
    } else if (this.keys['ArrowRight'] || this.keys['d']) {
      if (this.x < canvasWidth - this.size) this.x += this.speed;
      this.direction = 'right';
    }
  }

  draw(ctx) {
    const sprite = this.sprites[this.direction];
    if (sprite) {
      // วาด Sprite ของทิศทางนั้นๆ ลงบน Canvas หลัก
      ctx.drawImage(sprite, this.x - 16, this.y - 16);
    }
  }
}