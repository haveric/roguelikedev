var AsciiMap = function() {
    this.xOffset = 0;
    this.yOffset = 8;
    this.letterWidth = 7;
    this.letterHeight = 10;

    this.FONT_SIZE = 10;
}

AsciiMap.prototype.drawCharacter = function(canvasState, character, x, y, color) {
    canvasState.setFillStyle(color);
    canvasState.setFont(this.FONT_SIZE * canvasState.scale + "px monospace");
    canvasState.context.fillText(character, (x * this.letterWidth + this.xOffset) * canvasState.scale, (y * this.letterHeight + this.yOffset) * canvasState.scale);
}

AsciiMap.prototype.drawBackground = function(canvasState, x, y, color) {
    canvasState.setFillStyle(color);

    var xStart = (x * this.letterWidth) * canvasState.scale;
    var yStart = (y * this.letterHeight) * canvasState.scale;
    canvasState.context.fillRect(Math.floor(xStart), Math.floor(yStart), Math.ceil(this.letterWidth * canvasState.scale), Math.ceil(this.letterHeight * canvasState.scale));
}