var GameMap = function(width, height) {
	this.width = width;
	this.height = height;
	
	this.tiles = this.initTiles();
}

GameMap.prototype.initTiles = function() {
	var tiles = this.create2dArray(this.width);
	
	for (var i = 0; i < this.width; i++) {
		for (var j = 0; j < this.height; j++) {
			tiles[i][j] = new Tile(false);
		}
	}
	
	tiles[30][22].setBlocked();
	tiles[31][22].setBlocked();
	tiles[32][22].setBlocked();
	
	return tiles;
}

GameMap.prototype.isBlocked = function(x, y) {
	var blocked = false;

	if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
		blocked = true;
	} else {
		blocked = this.tiles[x][y].blocked;
	}
	
	return blocked;
}

// TODO: Move this to generic util?
GameMap.prototype.create2dArray = function(rows) {
	var array = [];
	
	for (var i = 0; i < rows; i++) {
		array[i] = [];
	}
	
	return array;
}