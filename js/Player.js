class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 24; // ขนาดสำหรับการเช็กการชน (Collision)
    
    this.speed = 5; // ความเร็วการเดิน
    this.keys = {};
    
    // ทิศทางปัจจุบัน: 'down', 'up', 'left', 'right'
    this.direction = 'down';

    // เวกเตอร์การเคลื่อนที่จาก Joystick (ค่า x, y ระหว่าง -1.0 ถึง 1.0)
    this.moveVector = { x: 0, y: 0 };

    // วาด Pixel Art ตัวละครเก็บไว้ใน Canvas จำลอง (Offscreen Canvas)
    this.sprites = this.generatePixelSprites();

    // Event ดักจับการกดคีย์บอร์ด (คอมพิวเตอร์)
    window.addEventListener('keydown', e => this.keys[e.key] = true);
    window.addEventListener('keyup', e => this.keys[e.key] = false);
  }

  // 🎨 วาด Pixel Art ความละเอียดสูง 32x32 พิกเซล
  generatePixelSprites() {
    const directions = ['down', 'up', 'left', 'right'];
    const sprites = {};

    const C = {
      'H1': '#2b170c', 'H2': '#4a2c11', 'H3': '#6d421e',
      'S1': '#e0a96d', 'S2': '#ffdbac', 'S3': '#ffe8cd',
      'E1': '#0f172a', 'E2': '#ffffff',
      'B1': '#1d4ed8', 'B2': '#3b82f6', 'B3': '#60a5fa',
      'P1': '#0f172a', 'P2': '#1e293b',
      'F1': '#475569', 'F2': '#94a3b8',
      '.': null
    };

    const createMap32 = (drawCallback) => {
      const map = Array(32).fill(null).map(() => Array(32).fill('.'));
      drawCallback(map);
      return map;
    };

    const maps = {
      down: createMap32((m) => {
        for (let y = 2; y <= 8; y++) for (let x = 10; x <= 21; x++) m[y][x] = 'H2';
        for (let x = 11; x <= 20; x++) m[2][x] = 'H1';
        for (let x = 12; x <= 19; x++) m[3][x] = 'H3';
        
        for (let y = 9; y <= 16; y++) for (let x = 9; x <= 22; x++) m[y][x] = 'S2';
        for (let y = 10; y <= 16; y++) m[y][9] = 'S1';
        for (let y = 10; y <= 16; y++) m[y][22] = 'S1';
        
        m[9][9] = 'H2'; m[10][9] = 'H2';
        m[9][22] = 'H2'; m[10][22] = 'H2';

        m[12][12] = 'E1'; m[13][12] = 'E1'; m[12][13] = 'E2'; m[13][13] = 'E1';
        m[12][18] = 'E1'; m[13][18] = 'E1'; m[12][19] = 'E2'; m[13][19] = 'E1';

        m[15][15] = 'S1'; m[15][16] = 'S1';
        for (let y = 17; y <= 18; y++) for (let x = 13; x <= 18; x++) m[y][x] = 'S1';

        for (let y = 19; y <= 25; y++) for (let x = 8; x <= 23; x++) m[y][x] = 'B2';
        for (let y = 19; y <= 25; y++) { m[y][8] = 'B1'; m[y][23] = 'B1'; }
        m[19][15] = 'B3'; m[19][16] = 'B3';

        for (let y = 20; y <= 23; y++) { m[y][7] = 'S2'; m[y][24] = 'S2'; }

        for (let y = 26; y <= 29; y++) {
          for (let x = 9; x <= 14; x++) m[y][x] = 'P2';
          for (let x = 17; x <= 22; x++) m[y][x] = 'P2';
        }
        m[26][15] = 'P1'; m[26][16] = 'P1';

        for (let x = 8; x <= 14; x++) { m[30][x] = 'F1'; m[31][x] = 'F2'; }
        for (let x = 17; x <= 23; x++) { m[30][x] = 'F1'; m[31][x] = 'F2'; }
      }),

      up: createMap32((m) => {
        for (let y = 2; y <= 16; y++) for (let x = 9; x <= 22; x++) m[y][x] = 'H2';
        for (let y = 2; y <= 5; y++) for (let x = 11; x <= 20; x++) m[y][x] = 'H3';
        for (let y = 14; y <= 16; y++) for (let x = 9; x <= 22; x++) m[y][x] = 'H1';

        for (let y = 17; y <= 18; y++) for (let x = 13; x <= 18; x++) m[y][x] = 'S1';

        for (let y = 19; y <= 25; y++) for (let x = 8; x <= 23; x++) m[y][x] = 'B2';
        for (let y = 19; y <= 25; y++) { m[y][8] = 'B1'; m[y][23] = 'B1'; }

        for (let y = 26; y <= 29; y++) {
          for (let x = 9; x <= 14; x++) m[y][x] = 'P2';
          for (let x = 17; x <= 22; x++) m[y][x] = 'P2';
        }

        for (let x = 8; x <= 14; x++) { m[30][x] = 'F1'; m[31][x] = 'F1'; }
        for (let x = 17; x <= 23; x++) { m[30][x] = 'F1'; m[31][x] = 'F1'; }
      }),

      left: createMap32((m) => {
        for (let y = 3; y <= 8; y++) for (let x = 8; x <= 20; x++) m[y][x] = 'H2';
        for (let y = 9; y <= 16; y++) for (let x = 8; x <= 19; x++) m[y][x] = 'S2';
        for (let y = 9; y <= 16; y++) for (let x = 14; x <= 21; x++) m[y][x] = 'H2';

        m[12][10] = 'E1'; m[13][10] = 'E1'; m[12][11] = 'E2';

        for (let y = 17; y <= 18; y++) for (let x = 11; x <= 16; x++) m[y][x] = 'S1';

        for (let y = 19; y <= 25; y++) for (let x = 9; x <= 19; x++) m[y][x] = 'B2';
        for (let y = 21; y <= 24; y++) for (let x = 7; x <= 11; x++) m[y][x] = 'S2';

        for (let y = 26; y <= 29; y++) for (let x = 10; x <= 18; x++) m[y][x] = 'P2';

        for (let x = 8; x <= 18; x++) { m[30][x] = 'F1'; m[31][x] = 'F2'; }
      }),

      right: createMap32((m) => {
        for (let y = 3; y <= 8; y++) for (let x = 11; x <= 23; x++) m[y][x] = 'H2';
        for (let y = 9; y <= 16; y++) for (let x = 12; x <= 23; x++) m[y][x] = 'S2';
        for (let y = 9; y <= 16; y++) for (let x = 10; x <= 17; x++) m[y][x] = 'H2';

        m[12][21] = 'E1'; m[13][21] = 'E1'; m[12][20] = 'E2';

        for (let y = 17; y <= 18; y++) for (let x = 15; x <= 20; x++) m[y][x] = 'S1';

        for (let y = 19; y <= 25; y++) for (let x = 12; x <= 22; x++) m[y][x] = 'B2';
        for (let y = 21; y <= 24; y++) for (let x = 20; x <= 24; x++) m[y][x] = 'S2';

        for (let y = 26; y <= 29; y++) for (let x = 13; x <= 21; x++) m[y][x] = 'P2';

        for (let x = 13; x <= 23; x++) { m[30][x] = 'F1'; m[31][x] = 'F2'; }
      })
    };

    directions.forEach(dir => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 48;  
      offCanvas.height = 48;
      const offCtx = offCanvas.getContext('2d');
      const pixelSize = 1.5; 

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
    let vx = 0;
    let vy = 0;

    // 1. รับค่าจาก คีย์บอร์ด (PC)
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']||this.key['ไ']||this.key['"']) vy -= 1;
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']||this.key['ห']||this.key['ฆ']) vy += 1;
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']||this.key['ฟ']||this.key['ฤ']) vx -= 1;
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']||this.key['ก']||this.key['ฏ']) vx += 1;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    // 2. ถ้ามีการลาก Virtual Joystick (ใช้อย่างน้อย > 0.01 เพื่อป้องกันปัญหาลอยตัว)
    if (Math.abs(this.moveVector.x) > 0.01 || Math.abs(this.moveVector.y) > 0.01) {
      vx = this.moveVector.x;
      vy = this.moveVector.y;
    }

    // คำนวณการเดิน
    this.x += vx * this.speed;
    this.y += vy * this.speed;

    // เปลี่ยนทิศทาง Sprite
    if (Math.abs(vx) > Math.abs(vy)) {
      if (vx > 0) this.direction = 'right';
      else if (vx < 0) this.direction = 'left';
    } else if (Math.abs(vy) > 0) {
      if (vy > 0) this.direction = 'down';
      else if (vy < 0) this.direction = 'up';
    }
  }

  draw(ctx) {
    const sprite = this.sprites[this.direction];
    if (sprite) {
      ctx.drawImage(sprite, this.x - 24, this.y - 24);
    }
  }
}