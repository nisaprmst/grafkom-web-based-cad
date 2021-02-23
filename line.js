class Line {
    constructor(firstPoint, secondPoint, color) {
      this.x1 = firstPoint.x;
      this.y1 = firstPoint.y;
      this.x2 = secondPoint.x;
      this.y2 = secondPoint.y;
      this.midPoint = new Point({x:(this.x1 + thix.x2)/2},
                                {y:(this.y1 + this.y2)/2});
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
    
    // resizeLine() {
    // //   
    // }
}