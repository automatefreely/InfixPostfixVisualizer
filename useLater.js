  add(element = null, index = null) {
    // getting the element
    const elementAdded = remover(this.elementInMove, element, index);
    // adding the element to allElement
    this.allElement = adder(this.allElement, elementAdded.index, elementAdded);
    // updating the arrayContainer
    this.arrayInfixContainer.add(elementAdded);
  }

  add(element) {
    const newArray = adder(this.array, element.index, element);
    this.#initProps(newArray);
  }