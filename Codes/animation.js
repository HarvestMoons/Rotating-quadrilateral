var currentAngle = 0.0, currentScale = 1.0;
var g_last = 0;
var tick = function () {
    var pauseTime = pauseEndTime - pauseStartTime
    var now = Date.now();
    if (g_last != 0)
        var elapsed = now - g_last - pauseTime;
    else
        var elapsed = 0
    pauseEndTime = pauseStartTime = 0
    g_last = now;//更新最近一次的调用时间

    currentAngle = calcAngle(currentAngle, elapsed);  // 更新旋转角
    currentScale = calcScale(currentScale, elapsed);  // 更新缩放倍率
    drawRotatedScaledImage(currentAngle, currentScale, u_ModelMatrix);//绘制旋转图形
    animationId = requestAnimationFrame(tick, canvas);
};

function calcAngle(oldAngle, elapsed) {
    var newAngle = oldAngle + (elapsed / 1000) * ANGLE_STEP;
    return newAngle %= 360;//结果对360度取余
}

var isEnlarge = false
var minScaleSize = 0.2
var maxScaleSize = 1.0
function calcScale(oldScale, elapsed) {
    if (isEnlarge)
        var newScale = oldScale + (elapsed / 1000) * 0.4;
    else
        var newScale = oldScale - (elapsed / 1000) * 0.4;
    if (newScale < minScaleSize) {
        isEnlarge = true;
        newScale = minScaleSize;
    }

    if (newScale > maxScaleSize) {
        isEnlarge = false;
        newScale = maxScaleSize;
    }
    return newScale
}

var pauseStartTime = 0, pauseEndTime = 0
function startAnimation() {
    if (g_last != 0)//g_last!=0,说明了不是第一次开始动画，此前必定有暂停，此时的pauseEndTime才有意义
        pauseEndTime = Date.now();
    animationId = requestAnimationFrame(tick, canvas);
}

function stopAnimation() {
    pauseStartTime = Date.now();
    cancelAnimationFrame(animationId);
}


