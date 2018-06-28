var Tile = function(blocked, blockSight = false) {
    this.blocked = blocked;
    this.blockSight = blocked || blockSight;
}

Tile.prototype.setBlocked = function(blocked) {
    if (blocked === undefined) {
        blocked = true;
    }
    this.blocked = blocked;
    this.blockSight = blocked;
}