"use strict";

var Tile = function(blocked, blockSight = false) {
    this.blocked = blocked;
    this.blockSight = blocked || blockSight;
}

Tile.prototype.setBlocked = function() {
    this.blocked = true;
    this.blockSight = true;
}