class Dustbin {
  constructor(x, y, heigth, width) {
    this.dx = x;
    this.dy = y;
    this.width = width;
    this.heigth = heigth;
    this.x = x + width / 2;
    this.y = y + heigth / 2;
  }
  loadImage(url) {
    this.url = url;
  }
  draw(ctx) {
    this.ctx = ctx;
    const image = new Image();
    image.src = this.url;
    image.onload = () => {
      ctx.drawImage(image, this.dx, this.dy, this.width, this.heigth);
    };
  }
  add(element) {
    glue(element, { x: this.x, y: this.y });
    this.draw(this.ctx);
  }
}
