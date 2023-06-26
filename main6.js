
console.log(infixToPostfixConverter("(m-n)*(p+q)"));

function infixToPostfixConverter(infix) {
  const expression = ["[", ...infix, "]"];

  const postfix = new Stack();
  const stack = new Stack();

  const braces = (b) => {
    if (b === "(" || b === ")") return [1, b === "("];
    else if (b === "{" || b === "}") return [2, b === "{"];
    else if (b === "[" || b === "]") return [3, b === "["];
    else return false;
  };

  const bracesOperater = (b, stack, postfix) => {
    if (!braces(b)) return false;
    const [braceIndex, isOpening] = braces(b);
    if (isOpening) return stack.push(b);
    else {
      while (1) {
        const poped = stack.pop();
        if (!braces(poped)) postfix.push(poped);
        else {
          const [bI, iO] = braces(poped);
          if (bI === braceIndex && iO === true) return;
        }
      }
    }
  };

  const operator = (o) => {
    if (o === "+" || o === "-") return 1;
    else if (o === "*" || o === "/") return 2;
    else if (o === "^") return 3;
    else return false;
  };

  const operateOperater = (o, stack, postfix) => {
    const optrIndex = operator(o);
    if (!optrIndex) return false;
    let optrIndexStackTop = operator(stack.top());
    if (!optrIndexStackTop || optrIndexStackTop < optrIndex)
      return stack.push(o);
    else {
      while (1) {
        if (optrIndexStackTop > optrIndex) postfix.push(stack.pop());
        else {
          stack.push(o);
          return;
        }
      }
    }
  };

  const alpNumOperation = (alpNum, stack, postfix) => {
    if (!braces(alpNum) && !operator(alpNum)) postfix.push(alpNum);
  };
  for (const symbol of expression) {
    alpNumOperation(symbol, stack, postfix);
    bracesOperater(symbol, stack, postfix);
    operateOperater(symbol, stack, postfix);
  }
  return [postfix, stack];
}



