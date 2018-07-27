"use strict";

var RenderOrder = {
    CORPSE: 1,
    ITEM: 2,
    ACTOR: 3
}

function drawText(canvasState, text, x, y, color, align, baseline) {
    canvasState.setFillStyle(color);
    canvasState.setFont(10);
    canvasState.setTextAlign(align || "start", baseline || "alphabetic");
    canvasState.fillText(text, x, y);
}

function drawRect(canvasState, x, y, w, h, color) {
    canvasState.setFillStyle(color);
    canvasState.fillRect(x, y, w, h);
}

function renderBar(canvasState, x, y, totalWidth, name, value, max, barColor, bgColor) {
    var barWidth = value / max * totalWidth;

    drawRect(canvasState, x, y, totalWidth, 10, bgColor);
    if (barWidth > 0) {
        drawRect(canvasState, x, y, barWidth, 10, barColor);
    }

    drawText(canvasState, "{0}: {1}/{2}".format(name, value, max), x + totalWidth / 2, y + 5, "#ffffff", "center", "middle");
}