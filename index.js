function getVerticesBuffer(vertices) {
  // Create an empty buffer object to store the vertex buffer
  var vertex_buffer = gl.createBuffer();
  //Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vertex_buffer;
}

function getIndicesBuffer(indices) {
  // Create an empty buffer object to store Index buffer
  var index_buffer = gl.createBuffer();

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

  // Pass the vertex data to the buffer
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  // Unbind the buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return index_buffer;
}

function getVertexShader() {
  var vertCode =
    "attribute vec3 coordinates;" +
    "void main(void) {" +
    " gl_Position = vec4(coordinates, 1.0);" +
    "gl_PointSize = 10.0;" +
    "}";

  // Create a vertex shader object
  var vertShader = gl.createShader(gl.VERTEX_SHADER);

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);

  return vertShader;
}

function getFragmentShader(rgb) {
  // fragment shader source code
  var fragCode = `void main(void) {
      gl_FragColor = vec4(${rgb.red}, ${rgb.green}, ${rgb.blue}, 1);
    }`;

  // Create fragment shader object
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  // Attach fragment shader source code
  gl.shaderSource(fragShader, fragCode);

  // Compile the fragmentt shader
  gl.compileShader(fragShader);

  return fragShader;
}

function getShaderProgram(vertShader, fragShader) {
  // the combined shader program
  var shaderProgram = gl.createProgram();

  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader);

  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);

  // Link both programs
  gl.linkProgram(shaderProgram);

  // Use the combined shader program object
  gl.useProgram(shaderProgram);

  return shaderProgram;
}

function bindVertexBuffer(shaderProgram, vertex_buffer, index_buffer) {
  /*======== Associating shaders to buffer objects ========*/
  // Bind vertex buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  if (index_buffer) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  }

  // Get the attribute location
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

  // Enable the attribute
  gl.enableVertexAttribArray(coord);
}

function drawPrimitives() {
  // Draw the triangle
  gl.drawArrays(gl.POINTS, 0, 1);
}

function clearCanvas() {
  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  // Clear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function renderAll() {
  clearCanvas();
  for (let i = 0; i < canvasObject.length; i++) {
    canvasObject[canvasObject.length - i - 1].drawOnCanvas();
  }
}

function translateWidth(width) {
  let rect = canvas.getBoundingClientRect();
  return (width / rect.width) * 2;
}

function translatePointCoordinate(x, y) {
  let rect = canvas.getBoundingClientRect();
  let midX = rect.left + rect.width / 2;
  let midY = rect.top + rect.height / 2;
  return {
    x: (x - midX) / (rect.width / 2),
    y: -(y - midY) / (rect.height / 2),
  };
}

function canvasClick(e) {
  let midPoint = { x: e.clientX, y: e.clientY };
  let translatedMidPoint = translatePointCoordinate(midPoint.x, midPoint.y);
  if (currentMode == modes.DRAWING) {
    controlPoint.movePoint(translatedMidPoint.x, translatedMidPoint.y);
  } else {
    if (!selectedObject) {
      let selectedRectangles = getAllSelectedRectangle(translatedMidPoint);
      selectedObject = selectedRectangles[selectedRectangles.length - 1];
      console.log(selectedRectangles);
    } else {
      selectedObject = null;
    }
  }
}

function canvasMove(e) {
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

function enterMode(mode) {
  currentMode = mode;
}

function createRectangle() {
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

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        red: parseInt(result[1], 16) / 255,
        green: parseInt(result[2], 16) / 255,
        blue: parseInt(result[3], 16) / 255,
      }
    : null;
}

class Point {
  constructor(x, y) {
    this.vertices = [x, y, -0.5];
  }
  drawOnCanvas() {
    let vertex_buffer = getVerticesBuffer(this.vertices);
    let vertShader = getVertexShader();
    let fragShader = getFragmentShader({ red: 0.0, green: 1.0, blue: 0.0 }); // Create a shader program object to store
    let shaderProgram = getShaderProgram(vertShader, fragShader);
    bindVertexBuffer(shaderProgram, vertex_buffer);
    drawPrimitives();
  }
  movePoint(newX, newY) {
    this.vertices = [newX, newY, -0.5];
    renderAll();
  }
}

class Rectangle {
  constructor(midPoint, color) {
    this.midPoint = midPoint;
    this.color = color;
    this.width = 0.4;
    this.left = midPoint.x - this.width / 2;
    this.top = midPoint.y + this.width / 2;
    this.right = midPoint.x + this.width / 2;
    this.bottom = midPoint.y - this.width / 2;
    this.vertices = [
      this.left,
      this.top,
      0,
      this.left,
      this.bottom,
      0,
      this.right,
      this.top,
      0,
      this.right,
      this.bottom,
      0,
    ];
    this.indices = [0, 1, 3, 0, 3, 2];
  }
  drawOnCanvas() {
    let vertex_buffer = getVerticesBuffer(this.vertices);
    let index_buffer = getIndicesBuffer(this.indices);
    let vertShader = getVertexShader();
    let fragShader = getFragmentShader(this.color);
    let shaderProgram = getShaderProgram(vertShader, fragShader);
    bindVertexBuffer(shaderProgram, vertex_buffer, index_buffer);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  moveRectangle(newMidPoint) {
    this.left = newMidPoint.x - this.width / 2;
    this.top = newMidPoint.y + this.width / 2;
    this.right = newMidPoint.x + this.width / 2;
    this.bottom = newMidPoint.y - this.width / 2;
    this.vertices = [
      this.left,
      this.top,
      0,
      this.left,
      this.bottom,
      0,
      this.right,
      this.top,
      0,
      this.right,
      this.bottom,
      0,
    ];
    renderAll();
  }

  resizeRectangle(xCursor) {
    this.width = Math.abs(xCursor - this.midPoint.x);
    this.left = this.midPoint.x - this.width / 2;
    this.top = this.midPoint.y + this.width / 2;
    this.right = this.midPoint.x + this.width / 2;
    this.bottom = this.midPoint.y - this.width / 2;
    this.vertices = [
      this.left,
      this.top,
      0,
      this.left,
      this.bottom,
      0,
      this.right,
      this.top,
      0,
      this.right,
      this.bottom,
      0,
    ];
    renderAll();
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
