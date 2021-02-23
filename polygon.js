class Polygon {
    constructor(midPoint, color, numSides) {
        this.midPoint = midPoint;
        this.numSides = numSides;
        this.color = color;
        this.radius = 0.4;
        this.vertices = this.computePolygonVertices();
        this.indices = this.computePolygonIndices();
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
    computePolygonVertices() {
        let vertices = []
  
        for (let i=1; i<=this.numSides; i++)
        {
            let theta = 2.0 * Math.PI * i / this.numSides;
  
            let x = this.radius * Math.cos(theta) + this.midPoint.x;
            let y = this.radius * Math.sin(theta) + this.midPoint.y;
  
            vertices.push(x);
            vertices.push(y);
            vertices.push(0);
        }
        vertices.push(this.midPoint.x);
        vertices.push(this.midPoint.y);
        vertices.push(0);
        return vertices;
    }
  
    computePolygonIndices() {
        let indices = []
        for (let i=0; i < this.numSides; i++) {
            indices.push(i);
            indices.push((i+1)%this.numSides);
            indices.push(this.numSides);
        }
        return indices;
    }

    drawOnCanvas() {
      console.log("polygon");
      console.log(this.vertices);
      console.log(this.indices);
        let vertex_buffer = getVerticesBuffer(this.vertices);
        let index_buffer = getIndicesBuffer(this.indices);
        let vertShader = getVertexShader();
        let fragShader = getFragmentShader(this.color);
        let shaderProgram = getShaderProgram(vertShader, fragShader);
        transformObject(shaderProgram, this.xformMatrix);
        bindVertexBuffer(shaderProgram, vertex_buffer, index_buffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
  
    movePolygon(newMidPoint) {
        this.midPoint = newMidPoint;
        this.vertices = this.computePolygonVertices();
        renderAll();
    }
  
    resizePolygon(xCursor) {
        this.radius = Math.abs(xCursor - this.midPoint.x);
        this.vertices = this.computePolygonVertices();
        renderAll();
    }
  }