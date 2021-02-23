function getVerticesBuffer(vertices) {
  // Return buffer object to store the vertices
  var vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vertex_buffer;
}

function getIndicesBuffer(indices) {
  // Return buffer object to store indices
  var index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return index_buffer;
}

function getVertexShader() {
  //Return shader that store vertex shader
  var vertCode =
    "attribute vec4 coordinates;" +
    "uniform mat4 u_xformMatrix;" +
    "void main(void) {" +
    " gl_Position = u_xformMatrix * coordinates;" +
    "gl_PointSize = 10.0;" +
    "}";

  var vertShader = gl.createShader(gl.VERTEX_SHADER);

  gl.shaderSource(vertShader, vertCode);

  gl.compileShader(vertShader);

  return vertShader;
}

function getFragmentShader(rgb) {
  // Return shader that store fragment shader (inc object color)
  var fragCode = `void main(void) {
        gl_FragColor = vec4(${rgb.red}, ${rgb.green}, ${rgb.blue}, 1);
      }`;

  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(fragShader, fragCode);

  gl.compileShader(fragShader);

  return fragShader;
}

function getShaderProgram(vertShader, fragShader) {
  // get program that contains vertex shader and fragment shader
  var shaderProgram = gl.createProgram();

  gl.attachShader(shaderProgram, vertShader);

  gl.attachShader(shaderProgram, fragShader);

  gl.linkProgram(shaderProgram);

  gl.useProgram(shaderProgram);

  return shaderProgram;
}

function transformObject(shaderProgram, xformMatrix) {
  //Transform object based on its transform matrix
  var u_xformMatrix = gl.getUniformLocation(shaderProgram, "u_xformMatrix");
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
}

function bindVertexBuffer(shaderProgram, vertex_buffer, index_buffer) {
  //Associating shaders to buffer objects
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  if (index_buffer) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  }

  var coord = gl.getAttribLocation(shaderProgram, "coordinates");

  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(coord);
}

function clearCanvas() {
  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  gl.enable(gl.DEPTH_TEST);

  gl.clear(gl.COLOR_BUFFER_BIT);
}

function renderAll() {
  //render all objects in canvas
  clearCanvas();
  for (let i = 0; i < canvasObject.length; i++) {
    canvasObject[canvasObject.length - i - 1].drawOnCanvas();
  }
}

function translateWidth(width) {
  //translate width to canvas coordinate (x -> -1 s.d 1, y -> -1 s.d 1)
  let rect = canvas.getBoundingClientRect();
  return (width / rect.width) * 2;
}

function translatePointCoordinate(x, y) {
  //translate a cursor coordinate into canvas coordinate
  let rect = canvas.getBoundingClientRect();
  let midX = rect.left + rect.width / 2;
  let midY = rect.top + rect.height / 2;
  return {
    x: (x - midX) / (rect.width / 2),
    y: -(y - midY) / (rect.height / 2),
  };
}

function hexToRgb(hex) {
  //convert color picker input that is in hex format into rgb format
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        red: parseInt(result[1], 16) / 255,
        green: parseInt(result[2], 16) / 255,
        blue: parseInt(result[3], 16) / 255,
      }
    : null;
}
