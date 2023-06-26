const myCanvas = document.getElementById("myCanvas");
myCanvas.height = window.innerHeight;
myCanvas.width = window.innerWidth;
const ctx = myCanvas.getContext("2d");
const point1 = { x: 100, y: 200 };
const point2 = { x: 200, y: 400 };
const point = { x: 100, y: 200 };

var t = 0;

animate();
function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  drawLine(point1, point2);
  drawPoint(point1, ctx, "A");
  drawPoint(point2, ctx, "B");
  point.x = lerp(point1.x, point2.x, t);
  point.y = lerp(point1.y, point2.y, t);
  drawPoint(point, ctx, "C");

  t += 0.01;

  if (t <= 1.01) {
    setTimeout(() => {
      animate();
    }, 10);
  } else {
    console.log(1);
  }
}

function drawPoint(point, ctx, label, color = "red") {
  if (point) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 14px Arial";
    ctx.fillText(label, point.x, point.y);
  }
}

function drawLine(p1, p2) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function lerp(A, B, t) {
  return A + (B - A) * t;
}
