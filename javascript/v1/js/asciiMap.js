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
    canvasState.setFont(this.FONT_SIZE);
    canvasState.setTextAlign("center", "middle");
    canvasState.fillText(character, x * this.letterWidth + this.xOffset, y * this.letterHeight + this.yOffset);
}

AsciiMap.prototype.drawBackground = function(canvasState, x, y, color) {
    canvasState.setFillStyle(color);
    canvasState.fillRect(x * this.letterWidth, y * this.letterHeight, this.letterWidth, this.letterHeight, (x + 1) * this.letterWidth, (y + 1) * this.letterHeight);
}