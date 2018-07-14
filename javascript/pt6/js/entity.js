"use strict";

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

    var entitiesInRenderOrder = this.entities.sort(function(e1, e2) {
        return e1.renderOrder - e2.renderOrder;
    });

    entitiesInRenderOrder.forEach(function(entity) {
        entity.render(asciiMap, canvasState, fovMap);
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


var Entity = function(x, y, character, color, name, blocks = false, renderOrder = RenderOrder.CORPSE, fighter = null, ai = null) {
    this.x = x;
    this.y = y;
    this.character = character;
    this.color = color;
    this.name = name;
    this.blocks = blocks;
    this.renderOrder = renderOrder;
    this.fighter = fighter;
    this.ai = ai;

    if (this.fighter) {
        this.fighter.owner = this;
    }

    if (this.ai) {
        this.ai.owner = this;
    }
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
    // TODO: Implement
}

Entity.prototype.distanceTo = function(other) {
    var dx = other.x - this.x;
    var dy = other.y - this.y;

    return Math.sqrt(dx * dx + dy * dy);
}

Entity.prototype.render = function(asciiMap, canvasState, fovMap) {
    if (fovMap.isPointInFov(this.x, this.y)) {
        asciiMap.drawCharacter(canvasState, this.character, this.x, this.y, this.color);
    }
}