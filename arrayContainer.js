class ArrayContainer {
  constructor(array, x, y, symbolProps, primary = true) {
    this.primary = primary;
    this.x = x;
    this.y = y;
    this.symbolProps = symbolProps;
    this.array = array;
    this.#initProps(array);
  }

  add(element) {
    if (this.primary) {
      if (!this.nowElements.find((value) => value.index === element.index)) {
        const actuallPoint = this.elements.find((value) => {
          return element.index === value.index;
        });
        glue(element, actuallPoint);
        this.nowElements.push(element);
        this.elementMoved.forEach((value, index) => {
          if (value.index === element.index) {
            this.elementMoved.splice(index, 1);
          }
        });
      }
    } else {
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
    }
  }

  remove(element) {
    if (this.primary) {
      if (!this.elementMoved.find((value) => value.index === element.index)) {
        this.elementMoved.push(element);
        this.nowElements.forEach((value, index) => {
          if (value.index === element.index) {
            this.nowElements.splice(index, 1);
          }
        });
      }
    } else {
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
    }
  }

  draw = (ctx) => {
    this.#drawBox(ctx);
    //draw dustbin

  };

  #initProps(array) {
    this.length = array.length;
    this.width = this.length * this.symbolProps.width;
    this.height = this.symbolProps.height;
    this.padding = 3;

    const x = this.x - this.padding;
    const y = this.y - this.padding;
    const width = this.width + this.padding * 2 * this.length;
    const height = this.height + this.padding * 2;
    const elements = new Array();
    for (let i = 0; i < this.length; i++) {
      const xi = lerp(x, x + width, i / this.length);
      elements.push({
        x: xi + width / (2 * this.length),
        y: y + height / 2,
        label: this.array[i],
        index: i,
      });
    }
    this.elements = elements;

    this.nowElements = this.primary
      ? JSON.parse(JSON.stringify(this.elements))
      : [];
    this.elementMoved = [];
  }

  #drawBox = (ctx) => {
    const x = this.x - this.padding;
    const y = this.y - this.padding;
    const width = this.width + this.padding * 2 * this.length;
    const height = this.height + this.padding * 2;

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.rect(x, y, width, height);
    ctx.stroke();

    for (let i = 0; i < this.length; i++) {
      const xi = lerp(x, x + width, i / this.length);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.moveTo(xi, y);
      ctx.lineTo(xi, y + height);
      ctx.stroke();
    }
    this.drawCount++;
  };
}
