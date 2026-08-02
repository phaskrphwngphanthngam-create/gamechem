class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 24; // ขนาดสำหรับการเช็กการชน (Collision)
    this.speed = 4;
    this.keys = {};
    
    // ทิศทางปัจจุบัน: 'down', 'up', 'left', 'right'
    this.direction = 'down';

    // วาด Pixel Art ตัวละครเก็บไว้ใน Canvas จำลอง (Offscreen Canvas)
    this.sprites = this.generatePixelSprites();

    // Event ดักจับการกดคีย์บอร์ด (คอมพิวเตอร์)
    window.addEventListener('keydown', e => this.keys[e.key] = true);
    window.addEventListener('keyup', e => this.keys[e.key] = false);

    // 📱 ดักจับการแตะปุ่มบนหน้าจอ (มือถือ & iPad)
    this.setupTouchControls();
  }

  // 📱 ฟังก์ชันเชื่อมปุ่ม Virtual D-Pad
  setupTouchControls() {
    const bindBtn = (btnId, keyName) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;

      const press = (e) => {
        e.preventDefault();
        this.keys[keyName] = true;
      };

      const release = (e) => {
        e.preventDefault();
        this.keys[keyName] = false;
      };

      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointerleave', release);
      btn.addEventListener('pointercancel', release);
    };

    bindBtn('btn-up', 'ArrowUp');
    bindBtn('btn-down', 'ArrowDown');
    bindBtn('btn-left', 'ArrowLeft');
    bindBtn('btn-right', 'ArrowRight');
  }

  // 🎨 วาด Pixel Art ความละเอียดสูง 32x32 พิกเซล
  generatePixelSprites() {
    const directions = ['down', 'up', 'left', 'right'];
    const sprites = {};

    // จานสีตัวละครแบบมีมิติ (Palette ละเอียดขึ้น มีสีเงา)
    const C = {
      // ผม (Hair)
      'H1': '#2b170c', // เงาผม
      'H2': '#4a2c11', // สีผมหลัก
      'H3': '#6d421e', // ไฮไลต์ผม

      // ผิว (Skin)
      'S1': '#e0a96d', // เงาผิว
      'S2': '#ffdbac', // ผิวหลัก
      'S3': '#ffe8cd', // ไฮไลต์แก้ม/หน้าผาก

      // ตา (Eyes)
      'E1': '#0f172a', // ตาดำ
      'E2': '#ffffff', // ประกายตาขาว

      // เสื้อ (Shirt - น้ำเงินมีมิติ)
      'B1': '#1d4ed8', // เงาเสื้อ
      'B2': '#3b82f6', // เสื้อหลัก
      'B3': '#60a5fa', // ปกเสื้อ/จุดสะท้อนแสง

      // กางเกง (Pants)
      'P1': '#0f172a', // เงากางเกง
      'P2': '#1e293b', // กางเกงหลัก

      // รองเท้า (Shoes)
      'F1': '#475569',
      'F2': '#94a3b8',

      '.': null // พื้นหลังโปร่งใส
    };

    // 💡 ฟังก์ชันสร้าง Array 32x32 แบบรวดเร็ว
    const createMap32 = (drawCallback) => {
      const map = Array(32).fill(null).map(() => Array(32).fill('.'));
      drawCallback(map);
      return map;
    };

    // ✏️ ผังพิกเซล 32x32 ของแต่ละทิศทาง
    const maps = {
      down: createMap32((m) => {
        // ผม (แถว 2-9)
        for (let y = 2; y <= 8; y++) for (let x = 10; x <= 21; x++) m[y][x] = 'H2';
        for (let x = 11; x <= 20; x++) m[2][x] = 'H1';
        for (let x = 12; x <= 19; x++) m[3][x] = 'H3'; // ไฮไลต์ผม
        
        // หน้าผากและใบหน้า (แถว 9-16)
        for (let y = 9; y <= 16; y++) for (let x = 9; x <= 22; x++) m[y][x] = 'S2';
        for (let y = 10; y <= 16; y++) m[y][9] = 'S1'; // เงาข้างแก้ม
        for (let y = 10; y <= 16; y++) m[y][22] = 'S1';
        
        // จอนผมลงมาข้างแก้ม
        m[9][9] = 'H2'; m[10][9] = 'H2';
        m[9][22] = 'H2'; m[10][22] = 'H2';

        // ดวงตา (มีประกายตา)
        // ตาซ้าย
        m[12][12] = 'E1'; m[13][12] = 'E1'; m[12][13] = 'E1'; m[13][13] = 'E1';
        m[12][13] = 'E2'; // แสงสะท้อนตา
        // ตาขวา
        m[12][18] = 'E1'; m[13][18] = 'E1'; m[12][19] = 'E1'; m[13][19] = 'E1';
        m[12][19] = 'E2';

        // ปาก/แก้ม
        m[15][15] = 'S1'; m[15][16] = 'S1';

        // คอ
        for (let y = 17; y <= 18; y++) for (let x = 13; x <= 18; x++) m[y][x] = 'S1';

        // ตัว/เสื้อ (แถว 19-25)
        for (let y = 19; y <= 25; y++) for (let x = 8; x <= 23; x++) m[y][x] = 'B2';
        // ปกเสื้อ / เงาสองข้าง
        for (let y = 19; y <= 25; y++) { m[y][8] = 'B1'; m[y][23] = 'B1'; }
        m[19][15] = 'B3'; m[19][16] = 'B3'; // ปกเสื้อขาว/ฟ้าอ่อน

        // แขนเสื้อ
        for (let y = 20; y <= 23; y++) { m[y][7] = 'S2'; m[y][24] = 'S2'; }

        // กางเกง (แถว 26-29)
        for (let y = 26; y <= 29; y++) {
          for (let x = 9; x <= 14; x++) m[y][x] = 'P2'; // ขาซ้าย
          for (let x = 17; x <= 22; x++) m[y][x] = 'P2'; // ขาขวา
        }
        m[26][15] = 'P1'; m[26][16] = 'P1'; // เงาร่องเป้า

        // รองเท้า (แถว 30-31)
        for (let x = 8; x <= 14; x++) { m[30][x] = 'F1'; m[31][x] = 'F2'; }
        for (let x = 17; x <= 23; x++) { m[30][x] = 'F1'; m[31][x] = 'F2'; }
      }),

      up: createMap32((m) => {
        // ด้านหลังหัวผมล้วน (แถว 2-16)
        for (let y = 2; y <= 16; y++) for (let x = 9; x <= 22; x++) m[y][x] = 'H2';
        for (let y = 2; y <= 5; y++) for (let x = 11; x <= 20; x++) m[y][x] = 'H3'; // เงาผมหลังหัว
        for (let y = 14; y <= 16; y++) for (let x = 9; x <= 22; x++) m[y][x] = 'H1'; // เงาโคนคอ

        // คอหลัง
        for (let y = 17; y <= 18; y++) for (let x = 13; x <= 18; x++) m[y][x] = 'S1';

        // เสื้อด้านหลัง
        for (let y = 19; y <= 25; y++) for (let x = 8; x <= 23; x++) m[y][x] = 'B2';
        for (let y = 19; y <= 25; y++) { m[y][8] = 'B1'; m[y][23] = 'B1'; }

        // กางเกงด้านหลัง
        for (let y = 26; y <= 29; y++) {
          for (let x = 9; x <= 14; x++) m[y][x] = 'P2';
          for (let x = 17; x <= 22; x++) m[y][x] = 'P2';
        }

        // รองเท้าหลัง
        for (let x = 8; x <= 14; x++) { m[30][x] = 'F1'; m[31][x] = 'F1'; }
        for (let x = 17; x <= 23; x++) { m[30][x] = 'F1'; m[31][x] = 'F1'; }
      }),

      left: createMap32((m) => {
        // หัวด้านข้าง
        for (let y = 3; y <= 8; y++) for (let x = 8; x <= 20; x++) m[y][x] = 'H2';
        for (let y = 9; y <= 16; y++) for (let x = 8; x <= 19; x++) m[y][x] = 'S2';
        for (let y = 9; y <= 16; y++) for (let x = 14; x <= 21; x++) m[y][x] = 'H2'; // ผมด้านหลัง

        // ตาข้างซ้าย
        m[12][10] = 'E1'; m[13][10] = 'E1'; m[12][11] = 'E2';

        // คอ
        for (let y = 17; y <= 18; y++) for (let x = 11; x <= 16; x++) m[y][x] = 'S1';

        // ตัวลำตัวข้าง
        for (let y = 19; y <= 25; y++) for (let x = 9; x <= 19; x++) m[y][x] = 'B2';
        for (let y = 21; y <= 24; y++) for (let x = 7; x <= 11; x++) m[y][x] = 'S2'; // แขนยื่นไปข้างหน้า

        // กางเกงขาข้าง
        for (let y = 26; y <= 29; y++) for (let x = 10; x <= 18; x++) m[y][x] = 'P2';

        // รองเท้า
        for (let x = 8; x <= 18; x++) { m[30][x] = 'F1'; m[31][x] = 'F2'; }
      }),

      right: createMap32((m) => {
        // หัวด้านข้างขวา
        for (let y = 3; y <= 8; y++) for (let x = 11; x <= 23; x++) m[y][x] = 'H2';
        for (let y = 9; y <= 16; y++) for (let x = 12; x <= 23; x++) m[y][x] = 'S2';
        for (let y = 9; y <= 16; y++) for (let x = 10; x <= 17; x++) m[y][x] = 'H2';

        // ตาข้างขวา
        m[12][21] = 'E1'; m[13][21] = 'E1'; m[12][20] = 'E2';

        // คอ
        for (let y = 17; y <= 18; y++) for (let x = 15; x <= 20; x++) m[y][x] = 'S1';

        // ลำตัวข้าง
        for (let y = 19; y <= 25; y++) for (let x = 12; x <= 22; x++) m[y][x] = 'B2';
        for (let y = 21; y <= 24; y++) for (let x = 20; x <= 24; x++) m[y][x] = 'S2';

        // กางเกง
        for (let y = 26; y <= 29; y++) for (let x = 13; x <= 21; x++) m[y][x] = 'P2';

        // รองเท้า
        for (let x = 13; x <= 23; x++) { m[30][x] = 'F1'; m[31][x] = 'F2'; }
      })
    };

    directions.forEach(dir => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 48;  
      offCanvas.height = 48;
      const offCtx = offCanvas.getContext('2d');
      
      // 💡 32x32 ใช้ขนาดพิกเซลละ 1.5 พิกเซล (32 * 1.5 = 48px พอดีหน้าจอ)
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
      ctx.drawImage(sprite, this.x - 24, this.y - 24);
    }
  }
}