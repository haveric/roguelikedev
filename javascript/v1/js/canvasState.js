"use strict";

var CanvasState = function(canvasId, width, height) {
    var self = this;

    self.CANVAS_WIDTH = width;
    self.CANVAS_HEIGHT = height;

    self.canvas = document.getElementById(canvasId);
    self.context = self.canvas.getContext("2d");

    self.resetStates();

    self.toScale = JSON.parse(localStorage.getItem("CanvasState.toScale")) || true;

    self.resizeListener = window.addEventListener("resize", function(e) {
        self.resizeCanvas();
    });

    self.resizeCanvas();
}

CanvasState.prototype.resetStates = function() {
    this.oldFillStyle = "none";
    this.oldFont = "none";
    this.oldAlign = "none";
    this.oldBaseline = "none";
}

CanvasState.prototype.resizeCanvas = function() {
    if (this.toScale) {
        var canvasRatio = this.CANVAS_WIDTH / this.CANVAS_HEIGHT;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var windowRatio = windowWidth / windowHeight;

        if (windowWidth > this.CANVAS_WIDTH && windowHeight > this.CANVAS_HEIGHT) {
            if (canvasRatio > windowRatio) {
                this.canvas.width = windowWidth;
                this.canvas.height = windowWidth * (1 / canvasRatio);
            } else {
                this.canvas.width = windowHeight * canvasRatio;
                this.canvas.height = windowHeight;
            }

            this.scale = this.canvas.width / this.CANVAS_WIDTH;
        }
    } else {
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;
        this.scale = 1;
    }

    this.resetStates();
}

CanvasState.prototype.toggleScale = function() {
    this.toScale = !this.toScale;
    localStorage.setItem("CanvasState.toScale", this.toScale);

    this.resizeCanvas();
}

CanvasState.prototype.clear = function(color) {
    var clearColor = color || "#000";
    this.setFillStyle(clearColor);
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasState.prototype.setFillStyle = function(fillStyle) {
    if (fillStyle != this.oldFillStyle) {
        this.context.fillStyle = fillStyle;
        this.oldFillStyle = fillStyle;
    }
}

CanvasState.prototype.setFont = function(size, font) {
    var size = size * this.scale;
    var font = font || "arial";

    var fontString = size + "px " + font;
    if (fontString != this.oldFont) {
        this.context.font = fontString;
        this.oldFont = fontString;
    }
}

CanvasState.prototype.setTextAlign = function(align, baseline) {
    if (align != this.oldAlign) {
        this.context.textAlign = align;
        this.oldAlign = align;
    }

    if (baseline != this.oldBaseline) {
        this.context.textBaseline = baseline;
        this.oldBaseline = baseline;
    }
}

CanvasState.prototype.fillText = function(text, x, y) {
    this.context.fillText(text, x * this.scale, y * this.scale);
}

CanvasState.prototype.fillRect = function(x, y, width, height, nextX, nextY) {
    var curX = Math.floor(x * this.scale);
    var curY = Math.floor(y * this.scale);
    var scaledWidth = width * this.scale;
    var scaledHeight = height * this.scale;

    var newWidth = Math.ceil(scaledWidth);
    var newHeight = Math.ceil(scaledHeight);

    if (nextX && nextY) {
        var curXPlus1 = Math.floor(nextX * this.scale);
        var curYPlus1 = Math.floor(nextY * this.scale);

        if (curX + scaledWidth > curXPlus1) {
            newWidth = Math.floor(scaledWidth);
        }

        if (curY + scaledHeight > curYPlus1) {
            newHeight = Math.floor(scaledHeight)
        }
    }

    this.context.fillRect(curX, curY, newWidth, newHeight);
}

CanvasState.prototype.drawImage = function(image, x, y, width, height) {
    if (image) {
        this.context.drawImage(image, Math.floor(x * this.scale), Math.floor(y * this.scale), Math.ceil(width * this.scale), Math.ceil(height * this.scale));
    }
}