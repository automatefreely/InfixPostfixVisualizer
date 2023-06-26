const myCanvas = document.getElementById("myCanvas");
myCanvas.height = window.innerHeight;
myCanvas.width = window.innerWidth;
const ctx = myCanvas.getContext("2d");
const expression = "(m-n)*(p+q)";

const containerManager = new ContainerManager(expression, {
  width: 30,
  height: 30,
});
containerManager.draw(ctx);
const mouse = { x: 0, y: 0 };
let movingPoint = mouse;
let startPosOfMovingPoint = { ...mouse };
let moving = false;

document.onmousedown = (ev) => {
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

  draw(mouse, ctx);
  requestAnimationFrame(animate);
}
