class Line {
    constructor(firstPoint, secondPoint, color) {
      this.color = color;
      this.vertices = [
        firstPoint.x, firstPoint.y, 0,
        secondPoint.x, secondPoint.y, 0,
      ];
      this.xformMatrix = new Float32Array([
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,      
      ]);
    }
    drawOnCanvas() {
      let vertex_buffer = getVerticesBuffer(this.vertices);
      let vertShader = getVertexShader();
      let fragShader = getFragmentShader(this.color);
      let shaderProgram = getShaderProgram(vertShader, fragShader);
      transformObject(shaderProgram, this.xformMatrix);
      bindVertexBuffer(shaderProgram, vertex_buffer);
      gl.drawArrays(gl.LINES, 0, 2);
    }
  }
  
  function createLine() {
    if (currentMode == modes.LINEFIRST) {
      firstPoint = { x: controlPoint.vertices[0], y: controlPoint.vertices[1] };
      currentMode = modes.LINESECOND;
    }
  }