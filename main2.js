const myCanvas = document.getElementById("myCanvas");
myCanvas.height = 550;
myCanvas.width = 900;
const ctx = myCanvas.getContext("2d");
let expression = "(m-n)*(p+q)";

const expressionUpdateBtn = document.getElementById("update");
const autoPlayBtn = document.getElementById("autoplay");
const infixInput = document.getElementById("infix");
const postfixInput = document.getElementById("postfix");


infixInput.value = expression;
const containerManager = new ContainerManager(expression, {
  width: 30,
  height: 30,
});
containerManager.draw(ctx);
const mouse = { x: 0, y: 0 };
let movingPoint = mouse;
let startPosOfMovingPoint = { ...mouse };
let moving = false;


let autoPlaying = false;

let postfix; 
let moves;

let updating= false

expressionUpdateBtn.addEventListener('click', ()=>{
  updating = true;
  autoPlayBtn.disabled = false;
  expression = infixInput.value;
  containerManager.init(expression, {
    width: 30,
    height: 30,
  });
  
  containerManager.draw(ctx);
  movingPoint = mouse;
  startPosOfMovingPoint = { ...mouse };
  moving = false;
  
  
  autoPlaying = false;
  
  postfix; 
  moves;
  
  updating= false;
  animate();
});

autoPlayBtn.addEventListener('click', async ()=>{
    autoPlaying = true;
    autoPlayBtn.disabled = true;
    expressionUpdateBtn.disabled = true;
    [postfix, moves] = infixToPostfixConverter(expression);
    console.log(postfix.array.join(""), moves);
    await mover();
    postfixInput.value = postfix.array.join("");
    expressionUpdateBtn.disabled = false;

    autoPlaying = false;
    animate();
})

document.onmousedown = async (ev) => {
  const [nearestElement, index] = nearestPoint(mouse, containerManager.ELEMENT);
  if (findDistance(mouse, nearestElement) < 20) {
    movingPoint = nearestElement;
    startPosOfMovingPoint = { ...nearestElement };
    if (
      pointInRegion({ x: ev.x, y: ev.y }, containerManager.arrayInfixContainer)
    ) {
      movePointWithMouse(nearestElement);
      containerManager.arrayInfixContainer.remove(movingPoint);
      moving = true;
    } else if (
      pointInRegion2({ x: ev.x, y: ev.y }, containerManager.stackContainer)
    ) {
      // if nearest element is top
      if (containerManager.stackContainer.top.index == nearestElement.index) {
        movePointWithMouse(nearestElement);
        containerManager.stackContainer.remove(movingPoint);
        moving = true;
        return;
      }
    } else if (
      pointInRegion(
        { x: ev.x, y: ev.y },
        containerManager.arrayPostfixContainer
      )
    ) {
      return;
      movePointWithMouse(nearestElement);
      containerManager.arrayPostfixContainer.remove(movingPoint);
      moving = true;
    } else {
      movePointWithMouse(nearestElement); 
      moving = true;
    }

    moving = true;
  }

  // if(findDistance(mouse, getRextCenter(autoPlayBtn)) < 20){
  //   alert("hello");
  //   autoPlaying = true;

  //   [postfix, moves] = infixToPostfixConverter(expression);
  //   console.log(postfix, moves);
  //   await mover();
  //     autoPlaying = false;
  //     animate();
  //   // setTimeout(()=>{
      
  //   // }, 10000);
  // }
};

document.onmouseup = (ev) => {
  if (moving) {
    if (
      pointInRegion({ x: ev.x, y: ev.y }, containerManager.arrayInfixContainer)
    ) {
      containerManager.arrayInfixContainer.add(movingPoint);
    } else if (
      pointInRegion2({ x: ev.x, y: ev.y }, containerManager.stackContainer)
    ) {
      containerManager.stackContainer.add(movingPoint);
    } else if (
      pointInRegion(
        { x: ev.x, y: ev.y },
        containerManager.arrayPostfixContainer,
        ctx
      )
    ) {
      containerManager.arrayPostfixContainer.add(movingPoint);
    }
    movePointWithMouse(mouse);
    movingPoint = mouse;
    startPosOfMovingPoint = { ...mouse };
    moving = false;
  }
};
movePointWithMouse(mouse);


animate();



function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  containerManager.draw(ctx);
  containerManager.update(ctx);


  // drawRect(autoPlayBtn, "Auto Play", ctx);

  console.log("🔥  normal playing")
  draw(mouse, ctx);
  if(!autoPlaying && !updating) requestAnimationFrame(animate);
}


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


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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