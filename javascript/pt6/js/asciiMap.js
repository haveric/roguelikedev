"use strict";

var AsciiMap = function() {
    this.xOffset = 5;
    this.yOffset = 5;
    this.letterWidth = 10;
    this.letterHeight = 10;

    this.FONT_SIZE = 10;
}

AsciiMap.prototype.drawCharacter = function(canvasState, character, x, y, color) {
    canvasState.setFillStyle(color);
    canvasState.setFont(this.FONT_SIZE * canvasState.scale + "px arial");
    canvasState.context.textAlign="center";
    canvasState.context.textBaseline="middle";
    canvasState.context.fillText(character, (x * this.letterWidth + this.xOffset) * canvasState.scale, (y * this.letterHeight + this.yOffset) * canvasState.scale);
}

AsciiMap.prototype.drawBackground = function(canvasState, x, y, color) {
    canvasState.setFillStyle(color);

    var xStart = (x * this.letterWidth) * canvasState.scale;
    var yStart = (y * this.letterHeight) * canvasState.scale;
    canvasState.context.fillRect(Math.floor(xStart), Math.floor(yStart), Math.ceil(this.letterWidth * canvasState.scale), Math.ceil(this.letterHeight * canvasState.scale));
}

AsciiMap.prototype.drawText = function(canvasState, text, x, y, color) {
    canvasState.setFillStyle(color);
    canvasState.setFont(this.FONT_SIZE * canvasState.scale + "px arial");
    canvasState.context.textAlign="start";
    canvasState.context.textBaseline="alphabetic";
    canvasState.context.fillText(text, (x * this.letterWidth + this.xOffset) * canvasState.scale, (y * this.letterHeight + this.yOffset) * canvasState.scale);
}