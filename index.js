function enterMode(mode) {
  //switch mode
  currentMode = mode;
}

function canvasClick(e) {
  //detect user click on canvas
  let midPoint = { x: e.clientX, y: e.clientY };
  let translatedMidPoint = translatePointCoordinate(midPoint.x, midPoint.y);
  if (currentMode == modes.DRAWING) {
    controlPoint.movePoint(translatedMidPoint.x, translatedMidPoint.y);
  } else {
    if (!selectedObject) {
      let selectedRectangles = getAllSelectedRectangle(translatedMidPoint);
      selectedObject = selectedRectangles[selectedRectangles.length - 1];
    } else {
      selectedObject = null;
    }
  }
}

function createRectangle() {
  //create new triangle
  let hexColor = document.getElementById("colorPicker").value;
  if (currentMode == modes.DRAWING) {
    let midPoint = { x: controlPoint.vertices[0], y: controlPoint.vertices[1] };
    let rect = new Rectangle(midPoint, hexToRgb(hexColor));
    canvasObject.push(rect);
    renderAll();
  }
}

function getAllSelectedRectangle(cursor) {
  //get all triangles that its area contains our mouse cursor
  let result = [];
  for (let i = 0; i < canvasObject.length; i++) {
    if (canvasObject[i] instanceof Rectangle) {
      let rect = canvasObject[i];
      if (
        cursor.x > rect.left &&
        cursor.x < rect.right &&
        cursor.y < rect.top &&
        cursor.y > rect.bottom
      ) {
        result.push(rect);
      }
    }
  }
  return result;
}

function canvasMove(e) {
  //detect user's cursor move on canvas
  if (currentMode == modes.MOVING && selectedObject) {
    setTimeout(function () {
      let cursor = { x: e.clientX, y: e.clientY };
      console.log(cursor);
      let translatedMidPoint = translatePointCoordinate(cursor.x, cursor.y);
      console.log(translatedMidPoint);
      selectedObject.moveRectangle(translatedMidPoint);
    }, 10);
  } else if (currentMode == modes.RESIZING && selectedObject) {
    setTimeout(function () {
      let cursor = { x: e.clientX, y: e.clientY };
      let translatedMidPoint = translatePointCoordinate(cursor.x, cursor.y);
      selectedObject.resizeRectangle(translatedMidPoint.x);
    }, 10);
  }
}

let canvas = document.getElementById("my_Canvas");
let gl = canvas.getContext("webgl");
const modes = {
  DRAWING: 1,
  MOVING: 2,
  RESIZING: 3,
};
currentMode = modes.DRAWING;
let selectedObject = null;
gl.viewport(0, 0, canvas.width, canvas.height);
clearCanvas();
canvasObject = []; //nanti masukin ke txt
controlPoint = new Point(0, 0);
canvasObject.push(controlPoint);
controlPoint.drawOnCanvas();
console.log(document.getElementById("colorPicker").value);
let rect = canvas.getBoundingClientRect();
console.log(rect.left);
console.log(rect.top);
