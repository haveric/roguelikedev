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

	for (i = xStart; i <= xEnd; i++) {
		this.checkLine(x, y, i, yStart);
		this.checkLine(x, y, i, yEnd);
	}

	for (j = yStart; j <= yEnd; j++) {
		this.checkLine(x, y, xStart, j);
		this.checkLine(x, y, xEnd, j);
	}
}

FovMap.prototype.checkLine = function(playerX, playerY, x2, y2) {
	var deltaX = x2 - playerX;
	var deltaY = y2 - playerY;
	if (deltaX == 0) {
		if (playerY < y2) {
			for (var i = playerY; i <= y2; i++) {
				var valid = this.checkPoint(playerX, playerY, playerX, i);

				if (!valid) {
					break;
				}
			}
		} else {
			for (var i = playerY; i >= y2; i--) {
				var valid = this.checkPoint(playerX, playerY, playerX, i);

				if (!valid) {
					break;
				}
			}
		}
	} else {
		var error = 0;

		if (Math.abs(deltaY) < Math.abs(deltaX)) {
			var deltaError = Math.abs(deltaY / deltaX);
			var y = playerY;
			if (playerX < x2) {
				for (var i = playerX; i <= x2; i++) {
					var valid = this.checkPoint(playerX, playerY, i, y);

					if (!valid) {
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
					var valid = this.checkPoint(playerX, playerY, i, y);

					if (!valid) {
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
			var deltaError = Math.abs(deltaX / deltaY);
			var x = playerX;
			if (playerY < y2) {
				for (var j = playerY; j <= y2; j++) {
					var valid = this.checkPoint(playerX, playerY, x, j);

					if (!valid) {
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
					var valid = this.checkPoint(playerX, playerY, x, j);

					if (!valid) {
						break;
					}

					error += deltaError;
					if (error >= .5) {
						x += Math.sign(deltaX) * 1;;
						error -= 1;
					}
				}
			}
		}
	}
}

FovMap.prototype.checkPoint = function(playerX, playerY, x, y) {
	var valid = true;
	var tile = this.tiles[x][y];
	tile.fovDistance = Math.max(Math.abs(x - playerX), Math.abs(y - playerY));
	if (tile.blockSight) {
		valid = false;
	}

	return valid;
}



// TODO: Move this to generic util?
FovMap.prototype.create2dArray = function(rows) {
    var array = [];

    for (var i = 0; i < rows; i++) {
        array[i] = [];
    }

    return array;
}