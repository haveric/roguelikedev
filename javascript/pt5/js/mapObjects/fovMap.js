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
    var tiles = this.create2dArray(this.width);

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

	for (var j = yStart; j <= yEnd; j++) {
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
	var deltaX = x2 - playerX;
	var deltaY = y2 - playerY;
	if (deltaX == 0) {
		if (playerY < y2) {
			for (var i = playerY + 1; i <= y2; i++) {
				if (!this.checkPoint(playerX, playerY, playerX, i, radius)) {
					break;
				}
			}
		} else {
			for (var i = playerY - 1; i >= y2; i--) {
				if (!this.checkPoint(playerX, playerY, playerX, i, radius)) {
					break;
				}
			}
		}
	} else if (deltaY == 0) {
		if (playerX < x2) {
			for (var i = playerX + 1; i <= x2; i++) {
				if (!this.checkPoint(playerX, playerY, i, playerY, radius)) {
					break;
				}
			}
		} else {
			for (var i = playerX - 1; i >= x2; i--) {
				if (!this.checkPoint(playerX, playerY, i, playerY, radius)) {
					break;
				}
			}
		}
	} else {
		var error = 0;
		var absDeltaX = Math.abs(deltaX);
		var absDeltaY = Math.abs(deltaY);

		if (absDeltaY < absDeltaX) {
			var deltaError = absDeltaY / absDeltaX;
			var y = playerY;

			if (playerX < x2) {
				for (var i = playerX; i <= x2; i++) {
					if (!this.checkPoint(playerX, playerY, i, y, radius)) {
						break;
					}

					error += deltaError;
					if (error >= .5) {
						y += Math.sign(deltaY) * 1;
						error -= 1;
					}
				}
			} else {
				for (var i = playerX; i >= x2; i--) {
					if (!this.checkPoint(playerX, playerY, i, y, radius)) {
						break;
					}

					error += deltaError;
					if (error >= .5) {
						y += Math.sign(deltaY) * 1;;
						error -= 1;
					}
				}
			}
		} else {
			var deltaError = absDeltaX / absDeltaY;
			var x = playerX;
			if (playerY < y2) {
				for (var j = playerY; j <= y2; j++) {
					if (!this.checkPoint(playerX, playerY, x, j, radius)) {
						break;
					}

					error += deltaError;
					if (error >= .5) {
						x += Math.sign(deltaX) * 1;
						error -= 1;
					}
				}
			} else {
				for (var j = playerY; j >= y2; j--) {
					if (!this.checkPoint(playerX, playerY, x, j, radius)) {
						break;
					}

					error += deltaError;
					if (error >= .5) {
						x += Math.sign(deltaX) * 1;
						error -= 1;
					}
				}
			}
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

	if (tile.fovDistance < 0) {
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

	if (tile.blockSight && tile.fovDistance < 0) {
		if (x > 0) {
			var left = this.tiles[x - 1][y];
			if (left.blockSight) {
				if (y > 0) {
					var top = this.tiles[x][y - 1];
					var topLeft = this.tiles[x - 1][y - 1];
					if (top.blockSight && !topLeft.blockSight && topLeft.fovDistance > -1) {
						this.lightPoint(playerX, playerY, x, y, radius);
						return;
					}
				}

				if (y < this.height - 1) {
					var bottom = this.tiles[x][y + 1];
					var bottomLeft = this.tiles[x - 1][y + 1];
					if (bottom.blockSight && !bottomLeft.blockSight && bottomLeft.fovDistance > -1) {
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
					if (top.blockSight && !topRight.blockSight && topRight.fovDistance > -1) {
						this.lightPoint(playerX, playerY, x, y, radius);
						return;
					}
				}

				if (y < this.height - 1) {
					var bottom = this.tiles[x][y + 1];
					var bottomRight = this.tiles[x + 1][y + 1];
					if (bottom.blockSight && !bottomRight.blockSight && bottomRight.fovDistance > -1) {
						this.lightPoint(playerX, playerY, x, y, radius);
						return;
					}
				}
			}
		}
	}
}


// TODO: Move this to generic util?
FovMap.prototype.create2dArray = function(rows) {
    var array = [];

    for (var i = 0; i < rows; i++) {
        array[i] = [];
    }

    return array;
}