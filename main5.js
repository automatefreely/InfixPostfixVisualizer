const myCanvas = document.getElementById("myCanvas");
myCanvas.height = window.innerHeight;
myCanvas.width = window.innerWidth;
const ctx = myCanvas.getContext("2d");
const expression = "(m-n)*(p+q)";
const { postfix, transforms } = infixToPostfixConverter(expression);
console.log(postfix, transforms);
const containerManager = new ContainerManager(expression, {
  width: 30,
  height: 30,
});

animate();


// give deep copy
function infixToPostfixConverter(expression) {
  const postfix = [];
  const stack = [];
  const openingBraces = ["(", "{", "["];
  const closingBraces = [")", "}", "]"];
  const operation = ["+", "-", "*", "/", "**", "^"];
  const containerManager = new ContainerManager(expression, {
    width: 30,
    height: 30,
  });
  const transforms = [];

  const elements = [
    { label: "[", isFake: true },
    ...containerManager.ELEMENT,
    { label: "]", isFake: true },
  ];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    let ob = openingBraces.find((value) => value === element.label);
    let cb = closingBraces.find((value) => value === element.label);
    let o = operation.find((value) => value === element.label);
    const initialPosition = { ...element };

    if (ob) {
      if (!element.isFake) {
        // move to final position
        containerManager.arrayInfixContainer.remove(element);
        containerManager.stackContainer.add(element);
        // arrayInfixContainer --> stackContainer
        transforms.push({ i: initialPosition, f: element });
      }

      stack.push(ob);
    } else if (cb) {
      while (true) {
        const poped = stack.pop();
        if (!openingBraces.find((value) => value === poped)) {
          if (!element.isFake) {
            containerManager.stackContainer.remove(element);
            containerManager.arrayPostfixContainer.add(element);
            transforms.push({ i: initialPosition, f: element });
          }

          postfix.push(poped);
        } else {
          break;
        }
      }
    } else if (o) {
      if (!element.isFake) {
        // move to final position
        containerManager.arrayInfixContainer.remove(element);
        containerManager.stackContainer.add(element);
        // arrayInfixContainer --> stackContainer
        transforms.push({ i: initialPosition, f: element });
      }

      stack.push(o);
    } else {
      if (!element.isFake) {
        containerManager.stackContainer.remove(element);
        containerManager.arrayPostfixContainer.add(element);
        transforms.push({ i: initialPosition, f: element });
      }

      postfix.push(element.label);
    }
  }
  return { postfix, transforms };
}
