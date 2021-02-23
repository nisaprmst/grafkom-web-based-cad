class Point {
  constructor(x, y) {
    this.vertices = [x, y, -0.5]; //-0.5 so the control point is on top of all other objects
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
    let fragShader = getFragmentShader({ red: 0.0, green: 1.0, blue: 0.0 }); // Create a shader program object to store
    let shaderProgram = getShaderProgram(vertShader, fragShader);
    transformObject(shaderProgram, this.xformMatrix);
    bindVertexBuffer(shaderProgram, vertex_buffer);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
  movePoint(newX, newY) {
    this.vertices = [newX, newY, -0.5];
    renderAll();
  }
}
