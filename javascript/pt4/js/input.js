"use strict";

var Input = function() {
    var self = this;
    self.keysDown = [];

    self.keyDownListener = window.addEventListener("keydown", function (e) {
        self.addKey(e.keyCode);
    });

    self.keyUpListener = window.addEventListener("keyup", function (e) {
        self.removeKey(e.keyCode);
    });
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