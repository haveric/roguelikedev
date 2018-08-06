"use strict";

var Tile = function(blocked, blockSight) {
    this.blocked = blocked;
    this.blockSight = blocked || blockSight || false;
    this.explored = false;
}

Tile.prototype.setBlocked = function(blocked) {
    if (blocked === undefined) {
        blocked = true;
    }
    this.blocked = blocked;
    this.blockSight = blocked;
}

var FovTile = function(blocked, blockSight, fovDistance) {
    Tile.call(this, blocked, blockSight);
    this.fovDistance = fovDistance;
}

FovTile.prototype = new Tile();
FovTile.prototype.constructor = FovTile;