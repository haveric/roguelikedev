"use strict";

var Rect = function(x, y, width, height) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + width;
    this.y2 = y + height;
}

Rect.prototype.getCenterX = function() {
    return Math.floor((this.x1 + this.x2) / 2);
}

Rect.prototype.getCenterY = function() {
    return Math.floor((this.y1 + this.y2) / 2);
}

Rect.prototype.intersects = function(otherRect) {
    return (this.x1 <= otherRect.x2 && this.x2 >= otherRect.x1 &&
           this.y1 <= otherRect.y2 && this.y2 >= otherRect.y1);
}