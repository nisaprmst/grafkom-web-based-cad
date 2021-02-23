function enterMode(mode) {
  //switch mode
  currentMode = mode;
}

function canvasClick(e) {
  //detect user click on canvas
  let midPoint = { x: e.clientX, y: e.clientY };
  let translatedMidPoint = translatePointCoordinate(midPoint.x, midPoint.y);

  console.log(currentMode);
  if (currentMode == modes.DRAWING) {
    controlPoint.movePoint(translatedMidPoint.x, translatedMidPoint.y);
    renderAll();
  } else if (currentMode == modes.DRAWLINE) {
    controlPoint.movePoint(translatedMidPoint.x, translatedMidPoint.y);
    secondPoint = new Point(translatedMidPoint.x, translatedMidPoint.y);
    createLine(firstPoint, secondPoint);
    enterMode(modes.DRAWING);
  } else {
    if (!selectedObject) {
      let selected = getAllSelected(translatedMidPoint);
      console.log(selected);
      selectedObject = selected[selected.length - 1];
    } else {
      selectedObject = null;
    }
  }
}

function createLineFirstPoint() {
  firstPoint = new Point(controlPoint.vertices[0], controlPoint.vertices[1]);
  enterMode(modes.DRAWLINE);
}

function createLine(firstPoint, secondPoint) {
  // create new line
  let hexColor = document.getElementById("colorPicker").value;
  let line = new Line(
    { x: firstPoint.vertices[0], y: firstPoint.vertices[1] },
    { x: secondPoint.vertices[0], y: secondPoint.vertices[1] },
    hexToRgb(hexColor)
  );
  canvasObject.push(line);
  renderAll();
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

function createPolygon() {
  //create new triangle
  let hexColor = document.getElementById("colorPicker").value;
  if (currentMode == modes.DRAWING) {
    let midPoint = { x: controlPoint.vertices[0], y: controlPoint.vertices[1] };
    let rect = new Polygon(midPoint, hexToRgb(hexColor), 6);
    canvasObject.push(rect);
    renderAll();
  }
}

function insidePolygon(point, polygon) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  let x = point.x,
    y = point.y;
  let vs = polygon.vertices;
  let inside = false;
  // dikurangi 3 karena vertice terakhir isinya midpoint
  for (
    let i = 0, j = Math.floor(vs.length / 3) - 4;
    i < Math.floor(vs.length / 3) - 3;
    j = i++
  ) {
    let xi = vs[i * 3],
      yi = vs[i * 3 + 1];
    let xj = vs[j * 3],
      yj = vs[j * 3 + 1];

    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

function inLine(point, line) {
  let m =
    (line.vertices[4] - line.vertices[1]) /
    (line.vertices[3] - line.vertices[0]);
  let b = line.vertices[1] - m * line.vertices[0];
  let f = m * point.x + b;
  let y = point.y;

  return Math.abs(f - y) <= 0.02;
}

function getAllSelected(cursor) {
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
    } else if (canvasObject[i] instanceof Polygon) {
      let poly = canvasObject[i];
      if (insidePolygon(cursor, poly)) {
        result.push(poly);
      }
    } else if (canvasObject[i] instanceof Line) {
      let line = canvasObject[i];
      if (inLine(cursor, line)) {
        result.push(line);
      }
    }
  }
  return result;
}

// function getAllSelectedLine(cursor) {
//   let result = [];
//   for (let i = 0; i < canvasObject.length; i++) {
//     if (canvasObject[i] instanceof Line) {
//       let line = canvasObject[i];
//       if (
//         cursor.x
//       )
//   }
// }

function canvasMove(e) {
  //detect user's cursor move on canvas
  if (currentMode == modes.MOVING && selectedObject) {
    setTimeout(function () {
      let cursor = { x: e.clientX, y: e.clientY };
      console.log(cursor);
      let translatedMidPoint = translatePointCoordinate(cursor.x, cursor.y);
      console.log(translatedMidPoint);
      if (selectedObject instanceof Rectangle) {
        selectedObject.moveRectangle(translatedMidPoint);
      } else {
        selectedObject.movePolygon(translatedMidPoint);
      }
    }, 10);
  } else if (currentMode == modes.RESIZING && selectedObject) {
    setTimeout(function () {
      let cursor = { x: e.clientX, y: e.clientY };
      let translatedMidPoint = translatePointCoordinate(cursor.x, cursor.y);
      if (selectedObject instanceof Rectangle) {
        selectedObject.resizeRectangle(translatedMidPoint.x);
      } else if (selectedObject instanceof Line) {
        selectedObject.resizeLine(translatedMidPoint.x, translatedMidPoint.y);
      }
      // else {
      //   se
      // }
    }, 10);
  }
}

/* MAIN */
let canvas = document.getElementById("my_Canvas");
let gl = canvas.getContext("webgl");
const modes = {
  DRAWING: 1,
  MOVING: 2,
  RESIZING: 3,
  DRAWLINE: 4,
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
let firstPoint;
let secondPoint;
