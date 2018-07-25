"use strict";

var CanvasState = function(canvasId, width, height) {
    var self = this;

    self.CANVAS_WIDTH = width;
    self.CANVAS_HEIGHT = height;

    self.canvas = document.getElementById(canvasId);
    self.context = self.canvas.getContext("2d");

    self.oldFillStyle = "none";
    self.oldFont = "none";

    self.toScale = JSON.parse(localStorage.getItem("CanvasState.toScale"));

    self.resizeListener = window.addEventListener("resize", function(e) {
        self.resizeCanvas();
    });

    self.resizeCanvas();
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

    this.oldFont = "none";
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

CanvasState.prototype.setFont = function(font) {
    if (font != this.oldFont) {
        this.context.font = font;
        this.oldFont = font;
    }
}