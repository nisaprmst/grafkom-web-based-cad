function enterMode(mode) {
  //switch mode
  currentMode = mode;
}

function loadFile() {
  console.log("Test");
  let file = document.getElementById("inputfile").files[0];
  let fr = new FileReader();
  fr.onload = function () {
    let result = fr.result.split("\n");
    canvasObject = [canvasObject[0]];
    let i = 0;
    while (i < result.length) {
      if (result[i] == "R") {
        i++;
        let midpointArr = result[i].split(" ");
        let midPoint = {
          x: parseFloat(midpointArr[0]),
          y: parseFloat(midpointArr[1]),
        };
        i++;
        let colorArr = result[i].split(" ");
        let color = {
          red: parseFloat(colorArr[0]),
          green: parseFloat(colorArr[1]),
          blue: parseFloat(colorArr[2]),
        };
        i++;
        let width = parseFloat(result[i]);
        i++;
        let attr = { midPoint: midPoint, color: color, width: width };
        canvasObject.push(new Rectangle(attr.midPoint, attr.color, attr.width));
      } else if (result[i] == "P") {
        i++;
        let midpointArr = result[i].split(" ");
        let midPoint = {
          x: parseFloat(midpointArr[0]),
          y: parseFloat(midpointArr[1]),
        };
        i++;
        let numSides = parseInt(result[i]);
        i++;
        let colorArr = result[i].split(" ");
        let color = {
          red: parseFloat(colorArr[0]),
          green: parseFloat(colorArr[1]),
          blue: parseFloat(colorArr[2]),
        };
        i++;
        let radius = parseFloat(result[i]);
        i++;
        let attr = {
          midPoint: midPoint,
          color: color,
          numSides: numSides,
          radius: radius,
        };
        canvasObject.push(
          new Polygon(attr.midPoint, attr.color, attr.numSides, attr.radius)
        );
      } else if (result[i] == "L") {
        i++;
        let coordinates = result[i].split(",");
        let firstPoint = { x: coordinates[0], y: coordinates[1] };
        let secondPoint = { x: coordinates[3], y: coordinates[4] };
        i++;
        let colorArr = result[i].split(" ");
        let color = {
          red: parseFloat(colorArr[0]),
          green: parseFloat(colorArr[1]),
          blue: parseFloat(colorArr[2]),
        };
        i++;
        let attr = {
          firstPoint: firstPoint,
          secondPoint: secondPoint,
          color: color,
        };
        canvasObject.push(
          new Line(attr.firstPoint, attr.secondPoint, attr.color)
        );
      } else if (result[i] == "") {
        i++;
      }
    }
    renderAll();
  };
  try {
    fr.readAsText(file);
  } catch (e) {}
}

function saveFile() {
  let filename = document.getElementById("fname").value;
  let text = "";
  for (let i = 0; i < canvasObject.length; i++) {
    if (canvasObject[i] instanceof Rectangle) {
      text += "R\n";
      text += `${canvasObject[i].midPoint.x} ${canvasObject[i].midPoint.y}\n`;
      text += `${canvasObject[i].color.red} ${canvasObject[i].color.green} ${canvasObject[i].color.blue}\n`;
      text += `${canvasObject[i].width}\n`;
    } else if (canvasObject[i] instanceof Polygon) {
      text += "P\n";
      text += `${canvasObject[i].midPoint.x} ${canvasObject[i].midPoint.y}\n`;
      text += `${canvasObject[i].numSides}\n`;
      text += `${canvasObject[i].color.red} ${canvasObject[i].color.green} ${canvasObject[i].color.blue}\n`;
      text += `${canvasObject[i].radius}\n`;
    } else if (canvasObject[i] instanceof Line) {
      text += "L\n";
      text += `${canvasObject[i].vertices}\n`;
      text += `${canvasObject[i].color.red} ${canvasObject[i].color.green} ${canvasObject[i].color.blue}\n`;
    }
  }
  let blob = new Blob([text], { type: "text/plain" });
  let link = document.createElement("a");
  link.download = filename;
  link.innerHTML = "Download File";
  link.href = window.URL.createObjectURL(blob);
  document.body.appendChild(link);
  console.log(canvasObject);
}

// function loadFile() {
//   // var filename = "readme.txt";
//   // var text = "Text of the file goes here.";
//   // var blob = new Blob([text], { type: "text/plain" });
//   // var link = document.createElement("a");
//   // link.download = filename;
//   // link.innerHTML = "Download File";
//   // link.href = window.URL.createObjectURL(blob);
//   // document.body.appendChild(link);
//   // console.log("Load File Success");
//   // var fr = new FileReader();
//   // fr.onload = function () {
//   //   console.log(fr.result);
//   //   //document.getElementById("output").textContent = fr.result;
//   // };
//   // fr.readAsText(document.getElementById("inputfile").file[0]);
// }

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

function createRectangle(attr) {
  //create new triangle
  let midPoint =
    attr && attr.midPoint
      ? attr.midPoint
      : { x: controlPoint.vertices[0], y: controlPoint.vertices[1] };
  let color =
    attr && attr.color
      ? attr.color
      : hexToRgb(document.getElementById("colorPicker").value);
  let width = attr && attr.width ? attr.width : 0.4;
  if (currentMode == modes.DRAWING) {
    let rect = new Rectangle(midPoint, color, width);
    canvasObject.push(rect);
    renderAll();
  }
}

function createPolygon(attr) {
  //create new triangle
  let midPoint =
    attr && attr.midPoint
      ? attr.midPoint
      : { x: controlPoint.vertices[0], y: controlPoint.vertices[1] };
  let color =
    attr && attr.color
      ? attr.color
      : hexToRgb(document.getElementById("colorPicker").value);
  let numSides = attr && attr.numSides ? attr.numSides : 6;
  let radius = attr && attr.radius ? attr.radius : 0.4;
  if (currentMode == modes.DRAWING) {
    let rect = new Polygon(midPoint, color, numSides, radius);
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
