"use strict";

var FovMap = function(gameMap) {
    this.width = gameMap.width;
    this.height = gameMap.height;

    this.tiles = this.init(gameMap);

    this.lastXStart = 0;
    this.lastXEnd = this.width - 1;
    this.lastYStart = 0;
    this.lastYEnd = this.height - 1;
}

FovMap.prototype.init = function(gameMap) {
    var tiles = Util.create2dArray(this.width);

    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            var tile = gameMap.tiles[i][j];
            tiles[i][j] = new FovTile(tile.blocked, tile.blockSight);
        }
    }

    return tiles;
}

FovMap.prototype.computeFov = function(x, y, radius, lightWalls) {
    // Reset previous lightmap
    for (var i = this.lastXStart; i <= this.lastXEnd; i++) {
        for (var j = this.lastYStart; j <= this.lastYEnd; j++) {
            this.tiles[i][j].fovDistance = -1;
        }
    }

    var xStart = Math.max(0, x - radius);
    var xEnd = Math.min(this.width - 1, x + radius);

    var yStart = Math.max(0, y - radius);
    var yEnd = Math.min(this.height - 1, y + radius);

    this.lastXStart = xStart;
    this.lastXEnd = xEnd;
    this.lastYStart = yStart;
    this.lastYEnd = yEnd;

    for (var i = xStart; i <= xEnd; i++) {
        this.checkLine(x, y, i, yStart, radius);
        this.checkLine(x, y, i, yEnd, radius);
    }

    for (var j = yStart + 1; j < yEnd; j++) {
        this.checkLine(x, y, xStart, j, radius);
        this.checkLine(x, y, xEnd, j, radius);
    }

    for (var i = xStart; i <= xEnd; i++) {
        for (var j = yStart; j <= yEnd; j++) {
            this.lightCorners(x, y, i, j, radius);
        }
    }
}

FovMap.prototype.checkLine = function(playerX, playerY, x2, y2, radius) {
    var dX = Math.abs(x2 - playerX);
    var dY = Math.abs(y2 - playerY);
    var sx = playerX < x2 ? 1 : -1;
    var sy = playerY < y2 ? 1 : -1;
    var err = (dX > dY ? dX : -dY) / 2;

    var x = playerX;
    var y = playerY;
    while(true) {
        if (!this.checkPoint(playerX, playerY, x, y, radius)) {
            break;
        }
        if (x == x2 && y == y2) {
            break;
        }
        var e2 = err;
        if (e2 > -dX) {
            err -= dY;
            x += sx;
        }
        if (e2 < dY) {
            err += dX;
            y += sy;
        }
    }
}

FovMap.prototype.checkPoint = function(playerX, playerY, x, y, radius) {
    var tile = this.tiles[x][y];

    this.lightPoint(playerX, playerY, x, y, radius);

    if (!tile.blockSight) {
        this.lightWalls(playerX, playerY, x, y, radius);
    }

    return !tile.blockSight;
}

FovMap.prototype.lightWalls = function(playerX, playerY, x, y, radius) {
    var tile = this.tiles[x-1][y];
    if (tile.blockSight) {
        this.lightPoint(playerX, playerY, x-1, y, radius);
    }
    tile = this.tiles[x+1][y];
    if (tile.blockSight) {
        this.lightPoint(playerX, playerY, x+1, y, radius);
    }
    tile = this.tiles[x][y-1];
    if (tile.blockSight) {
        this.lightPoint(playerX, playerY, x, y-1, radius);
    }
    tile = this.tiles[x][y+1];
    if (tile.blockSight) {
        this.lightPoint(playerX, playerY, x, y+1, radius);
    }
}

FovMap.prototype.lightPoint = function(playerX, playerY, x, y, radius) {
    var tile = this.tiles[x][y];

    if (!this.isTileInFov(tile)) {
        var newDistance = this.getDistanceToPlayer(playerX, playerY, x, y);
        if (newDistance <= radius) {
            tile.fovDistance = newDistance;
        }
    }
}

FovMap.prototype.getDistanceToPlayer = function(playerX, playerY, x, y) {
    return Math.max(Math.abs(x - playerX), Math.abs(y - playerY));
}

FovMap.prototype.lightCorners = function(playerX, playerY, x, y, radius) {
    var tile = this.tiles[x][y];

    if (tile.blockSight && !this.isTileInFov(tile)) {
        if (x > 0) {
            var left = this.tiles[x - 1][y];
            if (left.blockSight) {
                if (y > 0) {
                    var top = this.tiles[x][y - 1];
                    var topLeft = this.tiles[x - 1][y - 1];
                    if (top.blockSight && !topLeft.blockSight && this.isTileInFov(topLeft)) {
                        this.lightPoint(playerX, playerY, x, y, radius);
                        return;
                    }
                }

                if (y < this.height - 1) {
                    var bottom = this.tiles[x][y + 1];
                    var bottomLeft = this.tiles[x - 1][y + 1];
                    if (bottom.blockSight && !bottomLeft.blockSight && this.isTileInFov(bottomLeft)) {
                        this.lightPoint(playerX, playerY, x, y, radius);
                        return;
                    }
                }
            }
        }

        if (x < this.width - 1) {
            var right = this.tiles[x + 1][y];
            if (right.blockSight) {
                if (y > 0) {
                    var top = this.tiles[x][y - 1];
                    var topRight = this.tiles[x + 1][y - 1];
                    if (top.blockSight && !topRight.blockSight && this.isTileInFov(topRight)) {
                        this.lightPoint(playerX, playerY, x, y, radius);
                        return;
                    }
                }

                if (y < this.height - 1) {
                    var bottom = this.tiles[x][y + 1];
                    var bottomRight = this.tiles[x + 1][y + 1];
                    if (bottom.blockSight && !bottomRight.blockSight && this.isTileInFov(bottomRight)) {
                        this.lightPoint(playerX, playerY, x, y, radius);
                        return;
                    }
                }
            }
        }
    }
}



FovMap.prototype.isPointInFov = function(x, y) {
    var tile = this.tiles[x][y];

    return this.isTileInFov(tile);
}

FovMap.prototype.isTileInFov = function(tile) {
    return tile.fovDistance > -1;
}