"use strict";

var Tile = function(blocked, blockSight = false) {
    this.blocked = blocked;
    this.blockSight = blocked || blockSight;
	this.explored = false;
}

Tile.prototype.setBlocked = function(blocked) {
    if (blocked === undefined) {
        blocked = true;
    }
    this.blocked = blocked;
    this.blockSight = blocked;
}

var FovTile = function(blocked, blockSight = false, fovDistance) {
	Tile.call(this, blocked, blockSight);
	this.fovDistance = fovDistance;
}

FovTile.prototype = new Tile();
FovTile.prototype.constructor = FovTile;