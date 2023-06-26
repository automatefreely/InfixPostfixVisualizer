class Stack {
  constructor() {
    this.array = [];
  }
  push(element) {
    this.array.push(element);
  }
  pop() {
    if (!this.isEmpty()) return this.array.pop();
    else return null;
  }
  top() {
    if (!this.isEmpty()) return this.array[this.array.length - 1];
    else return null;
  }
  isEmpty() {
    return this.array.length === 0;
  }
}

// glue p1 with p2
const glue = (p1, p2) => {
  p1.x = p2.x;
  p1.y = p2.y;
};
const movePointWithMouse = (point) => {
  document.onmousemove = (ev) => {
    glue(point, ev);
  };
};

function findDistance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function nearestPoint(point, fixed_points) {
  let a = 10000000;
  let index = 0;

  let nearest_point = fixed_points[0];
  for (let i = 0; i < fixed_points.length; i++) {
    const Distance = findDistance(point, fixed_points[i]);
    if (Distance < a) {
      a = Distance;
      nearest_point = fixed_points[i];
      index = i;
    }
  }
  return [nearest_point, index];
}

const draw = (point, ctx) => {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.stroke();
};

function remover(array, element) {
  let index = null;
  for (let i = 0; i < array.length; i++) {
    if ((array[i].index = element.index)) {
      index = i;
    }
  }
  console.log(index);
  return array.splice(index, 1);
}

function pointInRegion(point, region, ctx) {
  const padding = region.padding ? region.padding : 0;
  const x = region.x - padding;
  const y = region.y - padding;
  const width = region.width + padding * 2 * region.length;
  const height = region.height + padding * 2;

  if (ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.rect(x, y, width, height);
    ctx.stroke();
  }

  return (
    x < point.x && point.x < x + width && y < point.y && point.y < y + height
  );
}

function pointInRegion2(point, region) {
  const padding = region.padding ? region.padding : 0;
  const x = region.x - padding;
  const y = region.y + padding;
  const height =
    (region.length + 1) * region.symbolProps.height +
    padding * 2 * (region.length + 1);
  const width = region.symbolProps.width + padding * 2;
  return (
    x < point.x && point.x < x + width && y > point.y && point.y > y - height
  );
}

// function infixToPostfixConverter(infix) {
//   const expression = ["[", ...infix, "]"];

//   const postfix = new Stack();
//   const stack = new Stack();

//   const braces = (b) => {
//     if (b === "(" || b === ")") return [1, b === "("];
//     else if (b === "{" || b === "}") return [2, b === "{"];
//     else if (b === "[" || b === "]") return [3, b === "["];
//     else return false;
//   };

//   const bracesOperater = (b, stack, postfix) => {
//     if (!braces(b)) return false;
//     const [braceIndex, isOpening] = braces(b);
//     if (isOpening) return stack.push(b);
//     else {
//       while (1) {
//         const poped = stack.pop();
//         if (!braces(poped)) postfix.push(poped);
//         else {
//           const [bI, iO] = braces(poped);
//           if (bI === braceIndex && iO === true) return;
//         }
//       }
//     }
//   };

//   const operator = (o) => {
//     if (o === "+" || o === "-") return 1;
//     else if (o === "*" || o === "/") return 2;
//     else if (o === "^") return 3;
//     else return false;
//   };

//   const operateOperater = (o, stack, postfix) => {
//     const optrIndex = operator(o);
//     if (!optrIndex) return false;
//     let optrIndexStackTop = operator(stack.top());
//     if (!optrIndexStackTop || optrIndexStackTop < optrIndex)
//       return stack.push(o);
//     else {
//       while (1) {
//         if (optrIndexStackTop > optrIndex) postfix.push(stack.pop());
//         else {
//           stack.push(o);
//           return;
//         }
//       }
//     }
//   };

//   const alpNumOperation = (alpNum, stack, postfix) => {
//     if (!braces(alpNum) && !operator(alpNum)) postfix.push(alpNum);
//   };
//   for (const symbol of expression) {
//     alpNumOperation(symbol, stack, postfix);
//     bracesOperater(symbol, stack, postfix);
//     operateOperater(symbol, stack, postfix);
//   }
//   return postfix;
// }

// function movePointWithMouse(point) {
//   document.onmousemove = (event) => {
//     point.x = event.x;
//     point.y = event.y;
//   };
// }

// document.onmousedown = (ev) => {
//   const nearest_point = nearestPoint(mouse, all_points);
//   if (findDistance(nearest_point, mouse) < 10) {
//     movePointWithMouse(nearest_point);
//   }
// };
// document.onmouseup = (e) => {
//   movePointWithMouse(mouse);
// };

// function moveFromTo(i, f) {
//   i.x = f.x;
//   i.y = f.y;

//   // init
//   t = 0;
//   // while (t <= 1) {
//   //   i.x = lerp(i.x, f.x, t);
//   //   i.y = lerp(i.y, f.y, t);
//   //   t = t + 0.01;
//   // }
// }

function lerp(a, b, t) {
  return a + (b - a) * t;
}
