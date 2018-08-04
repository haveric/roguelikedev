"use strict";

var Entities = function() {
    this.entities = [];
}

Entities.prototype.add = function(entity) {
    this.entities.push(entity);
}

Entities.prototype.remove = function(entity) {
    var index = this.entities.indexOf(entity);
    if (index > -1) {
        this.entities.splice(index, 1)
    }
}

Entities.prototype.removeAll = function() {
    this.entities = [];
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

    var entitiesInRenderOrder = this.entities.sort(function(e1, e2) {
        return e1.renderOrder - e2.renderOrder;
    });

    entitiesInRenderOrder.forEach(function(entity) {
        entity.render(asciiMap, gameMap, fovMap, canvasState);
    });
}

Entities.prototype.getBlockingEntitiesAtLocation = function(x, y) {
    var blockingEntity = null;
    for (var entity of this.entities) {
        if (entity.blocks && entity.x == x && entity.y == y) {
            blockingEntity = entity;
            break;
        }
    }

    return blockingEntity;
}

Entities.prototype.getNamesUnderMouse = function(mousePosition, fovMap, scale) {
    var x = Math.floor(mousePosition.x / (10 * scale));
    var y = Math.floor(mousePosition.y / (10 * scale));

    var names = "";
    for (var entity of this.entities) {
        if (entity.x == x && entity.y == y && fovMap.isPointInFov(entity.x, entity.y)) {
            if (names != "") {
                names += ", ";
            }

            names += entity.name.toUpperCase();
        }
    }

    return names;
}


var Entity = function(x, y, character, color, name, blocks, renderOrder, exploredVisible) {
    this.x = x;
    this.y = y;
    this.character = character;
    this.color = color;
    this.name = name;
    this.blocks = blocks || false;
    this.renderOrder = renderOrder || RenderOrder.CORPSE;
    this.exploredVisible = exploredVisible || false;
}

Entity.prototype.move = function(gameMap, dx, dy) {
    if (!gameMap.isBlocked(this.x + dx, this.y + dy)) {
        this.x += dx;
        this.y += dy;
    }
}

Entity.prototype.moveTowards = function(targetX, targetY, gameMap, entities) {
    var dx = targetX - this.x;
    var dy = targetY - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    dx = Math.round(dx / distance);
    dy = Math.round(dy / distance);

    var checkX = this.x + dx;
    var checkY = this.y + dy;

    if (!gameMap.isBlocked(checkX, checkY) && !entities.getBlockingEntitiesAtLocation(checkX, checkY)) {
        this.move(gameMap, dx, dy);
    }
}

Entity.prototype.moveAStar = function(target, entities, gameMap) {
    var astar = new AStarMap(gameMap);

    astar.init(this, target, entities, gameMap);

    var path = astar.search(this, target);

    if (path.length > 0 && path.length < 25) {
        var path = path[0];
        this.x = path.x;
        this.y = path.y;
    } else {
        this.moveTowards(target.x, target.y, gameMap, entities);
    }
}

Entity.prototype.distanceTo = function(other) {
    return this.distanceToPoint(other.x, other.y);
}

Entity.prototype.distanceToPoint = function(x, y) {
    var dx = x - this.x;
    var dy = y - this.y;

    return Math.sqrt(dx * dx + dy * dy);
}

Entity.prototype.render = function(asciiMap, gameMap, fovMap, canvasState) {
    if (fovMap.isPointInFov(this.x, this.y) || (this.exploredVisible && gameMap.tiles[this.x][this.y].explored)) {
        asciiMap.drawCharacter(canvasState, this.character, this.x, this.y, this.color);
    }
}