"use strict";

var Input = function(canvasState) {
    var self = this;
    self.keysDown = [];
    self.mousePosition = {
        x: 0,
        y: 0
    };
    self.mouse = {
        "left": false,
        "middle": false,
        "right": false
    }

    self.keyDownListener = window.addEventListener("keydown", function (e) {
        self.addKey(e.keyCode);
    });

    self.keyUpListener = window.addEventListener("keyup", function (e) {
        self.removeKey(e.keyCode);
    });

    self.mouseMoveListener = window.addEventListener("mousemove", function (e) {
        self.mousePosition = self.getMousePos(canvasState.canvas, e);
    });

    self.mouseClickListener = window.addEventListener("click", function(e) {
        switch (e.button) {
            case 0:
                self.mouse.left = true;
                break;
            case 1:
                self.mouse.middle = true;
                break;
            case 2:
                self.mouse.right = true;
                break;
            default:
                break;
        }
    });

    window.oncontextmenu = function(event) {
        var rect = canvasState.canvas.getBoundingClientRect();
        if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
            self.mouse.right = true;
            return false;
        }
    }
}

Input.prototype.clearMouseClicks = function() {
    this.mouse = {
        "left": false,
        "middle": false,
        "right": false
    }
}

Input.prototype.getMousePos = function(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

Input.prototype.getMouseTile = function(scale) {
    var x = Math.floor(this.mousePosition.x / (10 * scale));
    var y = Math.floor(this.mousePosition.y / (10 * scale));

    return {
        "x": x,
        "y": y
    }
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