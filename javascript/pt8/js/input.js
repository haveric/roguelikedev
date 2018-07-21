"use strict";

var Input = function(canvasState) {
    var self = this;
    self.keysDown = [];
    self.mousePosition = {
        x: 0,
        y: 0
    };

    self.keyDownListener = window.addEventListener("keydown", function (e) {
        self.addKey(e.keyCode);
    });

    self.keyUpListener = window.addEventListener("keyup", function (e) {
        self.removeKey(e.keyCode);
    });

    self.mouseListener = window.addEventListener("mousemove", function (e) {
        self.mousePosition = self.getMousePos(canvasState.canvas, e);
    });
}

Input.prototype.getMousePos = function(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

Input.prototype.addKey = function(key) {
    this.keysDown[key] = true;
}

Input.prototype.removeKey = function(key) {
    delete this.keysDown[key];
}

Input.prototype.isPressed = function(key) {
    return this.keysDown[key];
}