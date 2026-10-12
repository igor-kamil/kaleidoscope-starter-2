// Change these values, save, and try drawing again.
let brushSize = 5;
let ink = '#57dfc1';
let segments = 8;
let ribbonWidth = 12;
let ribbonBulge = 1.25;
let canvasStage;

function setup() {
  canvasStage = document.getElementById('artwork-stage');
  const canvas = createCanvas(canvasStage.clientWidth, canvasStage.clientHeight);
  canvas.parent(canvasStage);
  canvas.elt.setAttribute('aria-label', 'Interactive drawing canvas. Drag to draw symmetrical ribbons.');
  angleMode(DEGREES);
  background(12, 15, 24);
  strokeCap(ROUND);
}

function windowResized() {
  resizeCanvas(canvasStage.clientWidth, canvasStage.clientHeight);
  background(12, 15, 24);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    ink = color(random(80, 256), random(80, 256), random(80, 256));
  }
}

function drawRibbon(startX, startY, endX, endY) {
  push();
  const directionX = endX - startX;
  const directionY = endY - startY;
  const length = Math.hypot(directionX, directionY) || 1;
  const normalX = -directionY / length;
  const normalY = directionX / length;
  const width = Math.max(ribbonWidth, brushSize * 2);
  const bulge = width * ribbonBulge;

  noStroke();
  fill(ink);
  beginShape();
  vertex(startX, startY);
  bezierVertex(
    startX + directionX / 3 + normalX * bulge,
    startY + directionY / 3 + normalY * bulge,
    startX + directionX * 2 / 3 + normalX * bulge,
    startY + directionY * 2 / 3 + normalY * bulge,
    endX,
    endY
  );
  bezierVertex(
    startX + directionX * 2 / 3 - normalX * bulge,
    startY + directionY * 2 / 3 - normalY * bulge,
    startX + directionX / 3 - normalX * bulge,
    startY + directionY / 3 - normalY * bulge,
    startX,
    startY
  );
  endShape(CLOSE);
  pop();
}

function draw() {
// opaque background
background(12, 15, 24, 10);

  // Draw only while dragging inside the canvas.
  if (mouseIsPressed && mouseX >= 0 && mouseX < width &&
      mouseY >= 0 && mouseY < height &&
      pmouseX >= 0 && pmouseX < width &&
      pmouseY >= 0 && pmouseY < height) {
    stroke(ink);
    strokeWeight(brushSize);

    const previousX = pmouseX - width / 2;
    const previousY = pmouseY - height / 2;
    const currentX = mouseX - width / 2;
    const currentY = mouseY - height / 2;

    translate(width / 2, height / 2);
    for (let i = 0; i < segments; i++) {
      push();
      rotate(i * 360 / segments);
      drawRibbon(previousX, previousY, currentX, currentY);
      drawRibbon(-previousX, previousY, -currentX, currentY);
      line(previousX, previousY, currentX, currentY);
      line(-previousX, previousY, -currentX, currentY);
      pop();
    }
  }
}

function keyPressed() {
  // Clear the canvas when the user presses 'c' or 'C'.
  if (key === 'c' || key === 'C') {
    background(12, 15, 24);
  }
  // Save the canvas as a PNG file when the user presses 's' or 'S'.
  if (key === 's' || key === 'S') {
    saveCanvas('my-kaleidoscope', 'png');
  }
}
