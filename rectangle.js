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
    let index_buffer = getIndicesBuffer(this.indices);
    let vertShader = getVertexShader();
    let fragShader = getFragmentShader(this.color);
    let shaderProgram = getShaderProgram(vertShader, fragShader);
    transformObject(shaderProgram, this.xformMatrix);
    bindVertexBuffer(shaderProgram, vertex_buffer, index_buffer);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  moveRectangle(newMidPoint) {
    this.midPoint = newMidPoint;
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
    //let newWidth = Math.abs(xCursor - this.midPoint.x) * 2;
    //let scalePoint = newWidth / this.width;
    //update the xformMatrix
    //this.xformMatrix[0] = this.xformMatrix[5] = scalePoint;
    renderAll();
  }
}
