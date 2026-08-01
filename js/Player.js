class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 4;
    this.keys = {};

    window.addEventListener('keydown', e => this.keys[e.key] = true);
    window.addEventListener('keyup', e => this.keys[e.key] = false);
  }

  update(canvasWidth, canvasHeight) {
    if (this.keys['ArrowUp'] || this.keys['w']) if (this.y > this.size) this.y -= this.speed;
    if (this.keys['ArrowDown'] || this.keys['s']) if (this.y < canvasHeight - this.size) this.y += this.speed;
    if (this.keys['ArrowLeft'] || this.keys['a']) if (this.x > this.size) this.x -= this.speed;
    if (this.keys['ArrowRight'] || this.keys['d']) if (this.x < canvasWidth - this.size) this.x += this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
}