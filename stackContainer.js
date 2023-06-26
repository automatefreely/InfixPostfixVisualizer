class StackContainer {
  constructor(array, x, y, symbolProps) {
    this.x = x;
    this.y = y;
    this.symbolProps = symbolProps;
    this.array = array;
    this.#initProps(array);
  }

  add(element) {
    if (
      !this.nowElements.find((value) => value.index === element.index + 100)
    ) {
      const actuallPoint = this.elements.find((value, index) => {
        // return element.index + 100 === value.index;
        return index === this.nowElements.length;
      });
      glue(element, actuallPoint);
      this.nowElements.push(element);
      this.elementMoved.forEach((value, index) => {
        if (value.index === element.index) {
          this.elementMoved.splice(index, 1);
        }
      });
    }
    this.top = this.nowElements[this.nowElements.length - 1];
  }

  remove(element) {
    if (!this.elementMoved.find((value) => value.index === element.index)) {
      this.elementMoved.push(element);
      this.nowElements.forEach((value, index) => {
        if (value.index === element.index) {
          this.nowElements.splice(index, 1);
        }
      });
    }

    // update the element
    this.nowElements.forEach((value1, index1, array1) => {
      const actuallPoint = this.elements[index1];
      glue(value1, actuallPoint);
    });

    this.top = this.nowElements[this.nowElements.length - 1];
  }

  pop() {
    this.elementMoved.push(this.top);
    this.nowElements.forEach((value, index) => {
      if (value.index === this.top.index) {
        this.nowElements.splice(index, 1);
      }
    });

    // update the element
    this.nowElements.forEach((value1, index1, array1) => {
      const actuallPoint = this.elements[index1];
      glue(value1, actuallPoint);
    });

    this.top = this.nowElements[this.nowElements.length - 1];
  }

  draw = (ctx) => {
    this.#drawBox(ctx);
  };

  #initProps(array) {
    this.length = array.length;
    this.width = this.length * this.symbolProps.width;
    this.height = this.symbolProps.height;
    this.padding = 3;

    const x = this.x - this.padding;
    const y = this.y + this.padding;
    const height =
      (this.length + 1) * this.symbolProps.height +
      this.padding * 2 * (this.length + 1);
    const width = this.symbolProps.width + this.padding * 2;
    const elements = new Array();
    for (let i = 0; i < this.length; i++) {
      const yi = lerp(y, y + height, -i / this.length);
      elements.push({
        x: x + width / 2,
        y: yi - height / (2 * this.length),
        index: i + 100,
      });
    }
    this.elements = elements;

    this.nowElements = [];
    this.elementMoved = [];
    // this.elementMoved = JSON.parse(JSON.stringify(this.elements));

    this.top = this.nowElements[this.nowElements.length - 1];
  }

  #drawBox = (ctx) => {
    const x = this.x - this.padding;
    const y = this.y + this.padding;
    const height =
      (this.length + 1) * this.symbolProps.height +
      this.padding * 2 * (this.length + 1);
    const width = this.symbolProps.width + this.padding * 2;

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - height);
    ctx.moveTo(x + width, y - height);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
}
