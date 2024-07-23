var isdisplayBorder = true;
var isPlayingAnimation = false;
var isFirstStart = true
// 键盘按下事件处理函数
function onKeyDown(event) {
    if (event.key === "b" || event.key === "B") {
        isdisplayBorder = !isdisplayBorder;
        drawRotatedScaledImage(currentAngle, currentScale, u_ModelMatrix);
    }
    if (event.key === "e" || event.key === "E") {
        if (isPlayingAnimation) {
            stopAnimation();
            isPlayingAnimation = !isPlayingAnimation;
        }
        currentAngle = 0;
        currentScale = 1;
        drawRotatedScaledImage(currentAngle, currentScale, u_ModelMatrix);
    }
    if (event.key === "t" || event.key === "T") {
        isPlayingAnimation = !isPlayingAnimation;
        if (isPlayingAnimation) {
            startAnimation(isFirstStart);
            isFirstStart = false;
        }
        else
            stopAnimation();
    }
}

// 监听键盘按下事件
document.addEventListener("keydown", onKeyDown);

var isDrag = false;
var nearestVertexIndex = 0;
var circleRadius = 0.1;

//down和move分开 若合起来可能出现鼠标移动太快顶点落在后面的情况
//此处的所有距离均是实际距离的平方
document.onmousedown = function (event) {
    if (!isPlayingAnimation) {
        const effectiveDis = Math.pow(circleRadius, 2);
        var mouse = [event.offsetX, event.offsetY];
        mouse = canvas2webgl([mouse]);
        var distanceMin = Math.pow(circleRadius, 2) + 1;
        nearestVertexIndex = 0;
        //获取最近的顶点序号
        for (vertexIndex = 0; vertexIndex < vertex_pos.length; vertexIndex++) {
            var distance = Math.pow((mouse[0] - vertexInfoActual[vertexIndex][0]), 2) + Math.pow((mouse[1] - vertexInfoActual[vertexIndex][1]), 2);
            if (distanceMin > distance) {
                nearestVertexIndex = vertexIndex;
                distanceMin = distance;
            }
        }
        if (distanceMin < effectiveDis) {
            isDrag = true;
        }
    }
}


document.onmousemove = function (event) {
    if (isDrag) {
        //获取鼠标位置
        var mouse = [event.offsetX, event.offsetY];
        mouse = canvas2webgl([mouse]);
        //限制鼠标位置
        mouse[0] = mouse[0] > 1 ? 1 : mouse[0];
        mouse[0] = mouse[0] < -1 ? -1 : mouse[0];
        mouse[1] = mouse[1] > 1 ? 1 : mouse[1];
        mouse[1] = mouse[1] < -1 ? -1 : mouse[1];
        //计算鼠标对应图像位置
        var modelMatrix = new Matrix4();
        modelMatrix.setRotate(-currentAngle, 0, 0, 1);
        modelMatrix.scale(1 / currentScale, 1 / currentScale, 1 / currentScale);
        var vertex = new Vector4([mouse[0], mouse[1], 0, 0]);
        vertex = modelMatrix.multiplyVector4(vertex);
        var vertexCanvas = webgl2canvas([[vertex.elements[0], vertex.elements[1]]]);
        //更改点坐标
        vertex_pos[nearestVertexIndex] = [vertexCanvas[0], vertexCanvas[1], 0];
        drawRotatedScaledImage(currentAngle, currentScale, u_ModelMatrix);
    }
}

//鼠标抬起，必定不在拖拽状态
document.onmouseup = function (event) {
    isDrag = false;
}