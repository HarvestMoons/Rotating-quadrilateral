
function drawPolygonsBorder() {
    if (!isdisplayBorder)//若无需绘制，直接退出
        return;
    // 遍历四边形数组
    for (var i = 0; i < polygon.length; i++) {
        // 当前四边形的顶点索引
        var vertices = polygon[i];
        // 循环绘制当前四边形的连线
        for (var j = 0; j < vertices.length; j++) {
            var vertexLine = []
            // 当前点坐标
            for (var k = 0; k < 2; k++) {
                vertexLine.push(vertexInfo2D[vertices[j]][k])
            }
            addColor([1, 0, 0], vertexLine);
            // 下一个点坐标（循环连接，最后一个点连到第一个点）
            var nextIndex = (j + 1) % vertices.length;
            for (var k = 0; k < 2; k++) {
                vertexLine.push(vertexInfo2D[vertices[nextIndex]][k])
            }
            addColor([1, 0, 0], vertexLine);

            vertexLine = new Float32Array(vertexLine);
            gl.bufferData(gl.ARRAY_BUFFER, vertexLine, gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, 2)
            // 检查是否是第1个顶点，如果是，则绘制对角线

            if (j == 0) {
                var diagVertexLine = []
                //推入第一个顶点坐标
                for (var k = 0; k < 2; k++) {
                    diagVertexLine.push(vertexInfo2D[vertices[0]][k])
                }
                //推入第一个顶点红色
                addColor([1, 0, 0], diagVertexLine);
                //推入第二个点坐标
                for (var k = 0; k < 2; k++) {
                    diagVertexLine.push(vertexInfo2D[vertices[2]][k])
                }
                //推入第二个顶点红色
                addColor([1, 0, 0], diagVertexLine);
                diagVertexLine = new Float32Array(diagVertexLine);
                gl.bufferData(gl.ARRAY_BUFFER, diagVertexLine, gl.STATIC_DRAW);
                gl.drawArrays(gl.LINES, 0, 2)
            }
        }
    }
}

function drawTriangles() {
    clearCanvas()
    // 遍历四边形数组
    for (var i = 0; i < polygon.length; i++) {
        // 当前四边形的顶点索引
        var vertices = polygon[i];
        // 循环绘制当前四边形的连线
        var Triangles_1 = []
        for (var j = 0; j < 5; j++) {
            Triangles_1.push(vertexInfo2D[vertices[0]][j])
        }
        for (var j = 0; j < 5; j++) {
            Triangles_1.push(vertexInfo2D[vertices[1]][j])
        }
        for (var j = 0; j < 5; j++) {
            Triangles_1.push(vertexInfo2D[vertices[2]][j])
        }
        Triangles_1 = new Float32Array(Triangles_1)


        gl.bufferData(gl.ARRAY_BUFFER, Triangles_1, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        var Triangles_2 = []
        for (var j = 0; j < 5; j++) {
            Triangles_2.push(vertexInfo2D[vertices[0]][j])
        }
        for (var j = 0; j < 5; j++) {
            Triangles_2.push(vertexInfo2D[vertices[2]][j])
        }
        for (var j = 0; j < 5; j++) {
            Triangles_2.push(vertexInfo2D[vertices[3]][j])
        }
        Triangles_2 = new Float32Array(Triangles_2)


        gl.bufferData(gl.ARRAY_BUFFER, Triangles_2, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 3)

    }
}

function drawRotatedScaledImage(rotateAngle, Scale, u_ModelMatrix) {
    var modelMatrix = new Matrix4();
    modelMatrix.setRotate(rotateAngle, 0, 0, 1);
    modelMatrix.scale(Scale, Scale, Scale);
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    vertexInfoActual = renewActualVertexInfo(modelMatrix);
    drawTriangles();
    drawPolygonsBorder();
}

function addColor(color, points) {
    points.push(color[0]);
    points.push(color[1]);
    points.push(color[2]);
}

function clearCanvas() {
    gl.clear(gl.COLOR_BUFFER_BIT)
}
