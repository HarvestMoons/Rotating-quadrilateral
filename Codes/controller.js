
var canvas, gl_pos, gl, animationId, u_ModelMatrix
//顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_ModelMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';
//片元着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';


var vertexInfo2D;
var vertexInfoActual;

// 每秒旋转的角度（度数制）
var ANGLE_STEP = 45.0;

function main() {

    initVertexInfo();
    // 获取 canvas 元素
    canvas = document.getElementById('webgl');
    // 设置画布大小
    canvas.width = canvasSize.maxX;
    canvas.height = canvasSize.maxY;

    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // 背景色设置（纯黑）
    gl.clearColor(0, 0, 0, 1.0);

    // Get storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // 创建顶点缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return;
    }

    // 绑定顶点缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 向顶点缓冲区对象写入数据
    var vertexInfo1D = new Float32Array(vertexInfo2D.flat()); // 使用flat()方法将二维数组转为一维数组
    gl.bufferData(gl.ARRAY_BUFFER, vertexInfo1D, gl.STATIC_DRAW);
    var FSIZE = vertexInfo1D.BYTES_PER_ELEMENT;
    //缓冲区变量分配给Attribe变量a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    //开启Attribe变量a_Position
    gl.enableVertexAttribArray(a_Position);


    // Get the storage location of a_Position, assign buffer and enable
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

    drawRotatedScaledImage(0, 1, u_ModelMatrix);
}

function initVertexInfo() {
    //计算webgl下坐标
    gl_pos = canvas2webgl(vertex_pos)

    //合并顶点信息
    vertexInfo2D = gl_pos.map((vertex, index) => {
        var newVertex = vertex.slice();
        // 拓长为5位(x,y,r,g,b)
        newVertex.push(vertex_color[index][0] / 255, vertex_color[index][1] / 255, vertex_color[index][2] / 255);
        return newVertex;
    });
    // 转换为Float32Array类型
}

function renewVertexInfo() {
    gl_pos = canvas2webgl(vertex_pos);
    for (var i = 0; i < gl_pos.length; i++) {
        for (var j = 0; j < 2; j++) {
            vertexInfo2D[i][j] = gl_pos[i][j];
        }
    }
}

function renewActualVertexInfo(modelMatrix) {
    renewVertexInfo();
    var transformedVertices = [];
    for (var i = 0; i < vertex_pos.length; i++) {
        var vertex = new Vector4([vertexInfo2D[i][0], vertexInfo2D[i][1], 0, 0]); // 将顶点坐标转换为齐次坐标
        vertex = modelMatrix.multiplyVector4(vertex); // 应用模型矩阵进行变换
        transformedVertices.push([vertex.elements[0], vertex.elements[1]]); // 提取变换后的顶点坐标
    }
    return transformedVertices;
}

function canvas2webgl(vertex_pos) {
    if (vertex_pos.length == 1) {
        var canvasx = vertex_pos[0][0];
        var canvasy = vertex_pos[0][1];
        var glx = 2 * canvasx / canvasSize.maxX - 1;
        var gly = -(2 * canvasy / canvasSize.maxY - 1);
        return [glx, gly];
    } else {
        var newPos = [];
        for (var i = 0; i < vertex_pos.length; i++) {
            var canvasx = vertex_pos[i][0];
            var canvasy = vertex_pos[i][1];
            var glx = 2 * canvasx / canvasSize.maxX - 1;
            var gly = -(2 * canvasy / canvasSize.maxY - 1);
            newPos.push([glx, gly]);
        }
        return newPos;
    }
}

function webgl2canvas(vertex_pos) {
    if (vertex_pos.length == 1) {
        var glx = vertex_pos[0][0];
        var gly = vertex_pos[0][1];
        var canvasx = (glx + 1) * canvasSize.maxX / 2;
        var canvasy = (-gly + 1) * canvasSize.maxY / 2;
        return [canvasx, canvasy];
    } else {
        var newPos = [];
        for (var i = 0; i < vertex_pos.length; i++) {
            var glx = vertex_pos[i][0];
            var gly = vertex_pos[i][1];
            var canvasx = (glx + 1) * canvasSize.maxX / 2;
            var canvasy = (-gly + 1) * canvasSize.maxY / 2;
            newPos.push([canvasx, canvasy]);
        }
        return newPos;
    }
}
