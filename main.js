const myCanvas = document.getElementById("myCanvas");
myCanvas.height = window.innerHeight;
myCanvas.width = window.innerWidth;
const ctx = myCanvas.getContext("2d");
const expression = "(m-n)*(p+q)";

const [postfix, moves] = infixToPostfixConverter(expression);

console.log(postfix, moves);
const containerManager = new ContainerManager(expression, {
  width: 30,
  height: 30,
});

containerManager.draw(ctx);
containerManager.update(ctx);
mover();
async function mover() {
  for (let i = 0; i < moves.length; i++) {
    let t = 0;
    let { before, after } = moves[i];
    if (!after) after = containerManager.dustbin;
    const element = containerManager.ELEMENT.find(
      (value) => value.index === before.index
    );
    const distance = findDistance(before, after);
    const deltaT = (Math.round((2.5 / distance) * 1000) / 1000);
    console.log(deltaT);
    while (t < 1) {
      t += deltaT;
      const newPoint = {
        x: lerp(before.x, after.x, Math.sin(t * Math.PI/2)),
        y: lerp(before.y, after.y, Math.sin(t * Math.PI/2)),
      };
      glue(element, newPoint);
      await sleep(10);
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      containerManager.draw(ctx);
      containerManager.update(ctx);
    }
    glue(element, after);
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    containerManager.draw(ctx);
    containerManager.update(ctx);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// var t = 0;
// setTimeout(() => {
//   mover(moves);
// }, 10);

// animate();

// function animate() {
//   myCanvas.height = window.innerHeight;
//   myCanvas.width = window.innerWidth;
//   ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
//   containerManager.draw(ctx);
//   containerManager.update(ctx);
//   requestAnimationFrame(animate);
// }
// function mover(moves) {
//   if (moves.length) {
//     setTimeout(() => {
//       const move = moves.shift();
//       let { before, after } = move;
//       const element = containerManager.ELEMENT.find(
//         (value) => value.index === before.index
//       );
//       let x = 60;
//       if (!after) after = { x: x * moves.length, y: 60 };

//       const moving = () => {
//         t += 0.01;
//         glue(element, {
//           x: lerp(before.x, after.x, t),
//           y: lerp(before.y, after.y, t),
//         });
//         if (t <= 1) {
//           setTimeout(() => {
//             moving();
//           }, 10);
//         }
//       };
//       if (t <= 1) moving();
//       else {
//         mover(moves);
//         t = 0;
//       }
//       console.log(t);
//     }, 0);
//   }
// }

function infixToPostfixConverter(infix) {
  const containerManager = new ContainerManager(infix, {
    width: 30,
    height: 30,
  });

  const elements = [
    { label: "[" },
    ...JSON.parse(JSON.stringify(containerManager.ELEMENT)),
    { label: "]" },
  ];

  const moves = [];
  const postfix = new Stack();
  const stack = new Stack();

  const infixToStack = (element) => {
    if (element.x) {
      const before = { ...element };
      containerManager.arrayInfixContainer.remove(element);
      containerManager.stackContainer.add(element);
      moves.push({
        before: before,
        after: { ...element },
        type: "infixToStack",
      });
    }
  };
  const infixToDestroy = (element) => {
    if (element.x) {
      const before = { ...element };
      containerManager.arrayInfixContainer.remove(element);
      moves.push({ before: before, after: null, type: "infixToDestroy" });
    }
  };
  const stackToPostfix = (element) => {
    if (element.x) {
      const before = { ...element };
      containerManager.stackContainer.remove(element);
      containerManager.arrayPostfixContainer.add(element);
      moves.push({
        before: before,
        after: { ...element },
        type: "stackToPostfix",
      });
    }
  };
  const stackToDestroy = (element) => {
    if (element.x) {
      const before = { ...element };
      containerManager.stackContainer.remove(element);
      moves.push({ before: before, after: null, type: "stackToDestroy" });
    }
  };
  const infixToPostfix = (element) => {
    if (element.x) {
      const before = { ...element };
      containerManager.arrayInfixContainer.remove(element);
      containerManager.arrayPostfixContainer.add(element);
      moves.push({
        before: before,
        after: { ...element },
        type: "infixToPostfix",
      });
    }
  };

  const braces = (b) => {
    if (b === "(" || b === ")") return [1, b === "("];
    else if (b === "{" || b === "}") return [2, b === "{"];
    else if (b === "[" || b === "]") return [3, b === "["];
    else return false;
  };
  const operator = (o) => {
    if (o === "+" || o === "-") return 1;
    else if (o === "*" || o === "/") return 2;
    else if (o === "^") return 3;
    else return false;
  };
  const bracesOperater = (element, stack, postfix) => {
    const b = element.label;
    if (!braces(b)) return false;
    const [braceIndex, isOpening] = braces(b);
    if (isOpening) {
      // 1. remove from infix and add to stack -> 1
      infixToStack(element);
      return stack.push(b);
    } else {
      // 2. remove from infix and destroy -> 2
      infixToDestroy(element);
      while (1) {
        // remove from stack
        let popedElement = containerManager.stackContainer.top;
        const poped = stack.pop();
        if (!braces(poped)) {
          // 3. add to postfix-> 3
          let popedElement = containerManager.stackContainer.top;
          stackToPostfix(popedElement);
          postfix.push(poped);
        } else {
          const [bI, iO] = braces(poped);
          if (bI === braceIndex && iO === true) {
            // 4. destroy -> 4
            if (popedElement) stackToDestroy(popedElement);
            return;
          }
        }
      }
    }

    // else {
    //   // 2. remove from infix and destroy -> 2
    //   infixToDestroy(element);
    //   while (1) {
    //     const poped = stack.pop();
    //     if (!braces(poped)) {
    //       // 3. remove from stack and add to postfix-> 3
    //       stackToPostfix(element);
    //       postfix.push(poped);
    //     } else {
    //       const [bI, iO] = braces(poped);
    //       if (bI === braceIndex && iO === true) {
    //         // 4. remove from stack and destroy -> 4
    //         stackToDestroy(element);
    //         return;
    //       }
    //     }
    //   }
    // }
  };
  const operateOperater = (element, stack, postfix) => {
    const o = element.label;
    const optrIndex = operator(o);
    if (!optrIndex) return false;
    let optrIndexStackTop = operator(stack.top());
    if (!optrIndexStackTop || optrIndexStackTop < optrIndex) {
      // 5. remove from infix and add to stack -> 1
      infixToStack(element);
      return stack.push(o);
    } else {
      while (1) {
        let optrIndexStackTop = operator(stack.top());
        if (optrIndexStackTop > optrIndex) {
          // 6. remove from stack and add to postfix -> 3
          const popedElement = containerManager.stackContainer.top;
          // if (popedElement)
          stackToPostfix(popedElement);
          postfix.push(stack.pop());
        } else {
          // 7. remove from infix and add to stack -> 1
          infixToStack(element);
          stack.push(o);
          return;
        }
      }
    }

    // else {
    //   while (1) {
    //     if (optrIndexStackTop > optrIndex) {
    //       // 6. remove from stack and add to postfix -> 3
    //       stackToPostfix(element);
    //       postfix.push(stack.pop());
    //     } else {
    //       // 7. remove from infix and add to stack -> 1
    //       infixToStack(element);
    //       stack.push(o);
    //       return;
    //     }
    //   }
    // }
  };
  const alpNumOperation = (element, stack, postfix) => {
    const alpNum = element.label;
    if (!braces(alpNum) && !operator(alpNum)) {
      // 8. remove from infix and add to postfix -> 5 <-
      infixToPostfix(element);
      postfix.push(alpNum);
    }
  };

  for (const element of elements) {
    alpNumOperation(element, stack, postfix);
    bracesOperater(element, stack, postfix);
    operateOperater(element, stack, postfix);
  }
  return [postfix, moves];
}
