class ContainerManager {
  constructor(expression, symbolProps){
    this.init(expression, symbolProps);
  }
  init(expression, symbolProps) {
    this.symbolProps = symbolProps;

    this.arrayInfixContainer = new ArrayContainer(
      new Array(...expression),
      100,
      100,
      {
        width: 30,
        height: 30,
      }
    );
    this.stackContainer = new StackContainer(
      new Array(...expression),
      this.arrayInfixContainer.x +
        this.arrayInfixContainer.width +
        this.arrayInfixContainer.padding * expression.length +
        symbolProps.width * 3,
      0 +
        this.symbolProps.height * (expression.length + 4) +
        this.arrayInfixContainer.padding * expression.length,
      symbolProps
    );

    this.arrayPostfixContainer = new ArrayContainer(
      new Array(...expression),
      100,
      250,
      {
        width: 30,
        height: 30,
      },
      false
    );
    this.ELEMENT = [
      ...this.arrayInfixContainer.nowElements,
      ...this.arrayInfixContainer.elementMoved,
    ];

    this.dustbin = new Dustbin(250, 400, 60, 60);
    this.dustbin.loadImage("empty_recycle_bin.png");
  }



  draw(ctx) {
    const image = new Image();
    image.src = "empty_recycle_bin.png";
    image.onload = (ev) => {
      ctx.drawImage(image, 250, 400, 60, 60);
    };
    this.arrayInfixContainer.draw(ctx);
    this.stackContainer.draw(ctx);
    this.arrayPostfixContainer.draw(ctx);
    this.dustbin.draw(ctx);
  }
  update(ctx) {
    this.ELEMENT = [
      ...this.arrayInfixContainer.nowElements,
      ...this.arrayInfixContainer.elementMoved,
    ];
    this.#drawSymbols(ctx);
  }

  #drawSymbols(ctx) {
    for (let i = 0; i < this.ELEMENT.length; i++) {
      ctx.beginPath();
      ctx.font = "20px Georgia";
      const x = this.ELEMENT[i].x;
      const y = this.ELEMENT[i].y;

      ctx.fillRect(
        x - this.symbolProps.width / 2,
        y - this.symbolProps.height / 2,
        this.symbolProps.width,
        this.symbolProps.height
      );

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "yellow";
      ctx.fillText(this.ELEMENT[i].label, x, y);
      ctx.fillStyle = "black";
      ctx.stroke();
    }
  }
}
