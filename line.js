class Line {
  constructor(firstPoint, secondPoint, color) {
    this.color = color;
    this.vertices = [
      firstPoint.x,
      firstPoint.y,
      0,
      secondPoint.x,
      secondPoint.y,
      0,
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

  resizeLine(xCursor, yCursor) {
    let midX = (this.vertices[0] + this.vertices[3]) / 2;
    let midY = (this.vertices[1] + this.vertices[4]) / 2;
    let length = Math.abs(xCursor - midX);
    let height = Math.abs(yCursor - midY);
    this.vertices[0] = midX - length / 2;
    this.vertices[3] = midX + length / 2;
    this.vertices[1] = midY - height / 2;
    this.vertices[4] = midY + height / 2;
    renderAll();
  }
}
