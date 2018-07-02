var Entities = function() {
    this.entities = [];
}

Entities.prototype.add = function(entity) {
    this.entities.push(entity);
}

Entities.prototype.renderAll = function(asciiMap, gameMap, fovMap, canvasState) {
	for (var x = 0; x < gameMap.width; x++) {
		for (var y = 0; y < gameMap.height; y++) {
			var visibleDistance = fovMap.tiles[x][y].fovDistance;
			var wall = gameMap.tiles[x][y].blockSight;

			if (visibleDistance >= 0) {
				if (wall) {
					asciiMap.drawBackground(canvasState, x, y, "#826E32");
				} else {
					asciiMap.drawBackground(canvasState, x, y, "#C8B432");
				}

				gameMap.tiles[x][y].explored = true;
			} else if (gameMap.tiles[x][y].explored) {
				if (wall) {
					asciiMap.drawBackground(canvasState, x, y, "#000064");
				} else {
					asciiMap.drawBackground(canvasState, x, y, "#323296");
				}
			}
		}
	}

    this.entities.forEach(function(entity) {
        entity.render(asciiMap, canvasState, fovMap);
    });
}


var Entity = function(x, y, character, color) {
    this.x = x;
    this.y = y;
    this.character = character;
    this.color = color;
}

Entity.prototype.move = function(gameMap, dx, dy) {
    if (!gameMap.isBlocked(this.x + dx, this.y + dy)) {
        this.x += dx;
        this.y += dy;
    }
}

Entity.prototype.render = function(asciiMap, canvasState, fovMap) {
	if (fovMap.tiles[this.x][this.y].fovDistance > -1) {
		asciiMap.drawCharacter(canvasState, this.character, this.x, this.y, this.color);
	}
}