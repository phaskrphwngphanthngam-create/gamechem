class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 24; // ขยายขนาดสำหรับการเช็กการชน (Collision)
    this.speed = 4;
    this.keys = {};
    
    // ทิศทางปัจจุบัน: 'down', 'up', 'left', 'right'
    this.direction = 'down';

    // วาด Pixel Art ตัวละครเก็บไว้ใน Canvas จำลอง (Offscreen Canvas)
    this.sprites = this.generatePixelSprites();

    window.addEventListener('keydown', e => this.keys[e.key] = true);
    window.addEventListener('keyup', e => this.keys[e.key] = false);
  }

  // สร้าง Pixel Art สำหรับ 4 ทิศทาง
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
      // 💡 ขยาย Canvas รองรับตัวละครขนาด 48x48 Pixel
      offCanvas.width = 48;  
      offCanvas.height = 48;
      const offCtx = offCanvas.getContext('2d');
      
      // 💡 เพิ่มขนาดแต่ละพิกเซลจาก 4 เป็น 6 (ตัวละครจะใหญ่ขึ้นเห็นชัด)
      const pixelSize = 6; 

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
      // 💡 ลบออก 24 (ครึ่งหนึ่งของ 48) เพื่อวางศูนย์กลางรูปให้ตรงตำแหน่ง x, y พอดี
      ctx.drawImage(sprite, this.x - 24, this.y - 24);
    }
  }
}