"use strict";

var AStarTile = function(x, y, blocked) {
    this.blocked = blocked;
    this.x = x;
    this.y = y;

    this.f = null;
    this.g = null;
    this.parent = null;
    this.visited = false;
    this.closed = false;
}

var AStarMap = function(gameMap) {
    this.tiles = Util.create2dArray(gameMap.width);
}

AStarMap.prototype.init = function(self, target, entities, gameMap) {
    for (var x = 0; x < gameMap.width; x++) {
        for (var y = 0; y < gameMap.height; y++) {
            var gameTile = gameMap.tiles[x][y];

            this.tiles[x][y] = new AStarTile(x, y, gameTile.blocked);
        }
    }

    for (var entity of entities.entities) {
        if (entity.blocks && entity != self && entity != target) {
            this.tiles[entity.x][entity.y].blocked = true;
        }
    }
}

AStarMap.prototype.search = function(self, target) {
    var start = this.tiles[self.x][self.y];
    var goal = this.tiles[target.x][target.y];

    var open = [];
    open.push(start);
    start.visited = true;

    while (open.length > 0) {
        var lowIndex = 0;

        for (var i = 0; i < open.length; i++) {
            if (open[i].f < open[lowIndex]) {
                lowIndex = i;
            }
        }

        var currentNode = open[lowIndex];

        // End State
        if (currentNode == goal) {
            var cur = currentNode;
            var ret = [];
            while (cur.parent) {
                ret.push(cur);
                cur = cur.parent;
            }
            return ret.reverse();
        }

        open.splice(open.indexOf(currentNode), 1);

        currentNode.closed = true;

        var neighbors = this.getNeighbors(currentNode);

        for (var neighbor of neighbors) {
            if (neighbor.closed || neighbor.blocked) {
                continue;
            }

            var g = currentNode.g + 1;

            if (!neighbor.visited) {
                open.push(neighbor);
                neighbor.visited = true;
            } else if (g >= neighbor.g) {
                continue;
            }

            neighbor.parent = currentNode;
            neighbor.g = g;
            neighbor.f = neighbor.g + this.calculateHeuristic(neighbor, goal);
        }
    }

    return [];
}

AStarMap.prototype.distanceBetween = function(tile1, tile2) {
    return Util.getTileDistance(tile1.x, tile1.y, tile2.x, tile2.y);
}

AStarMap.prototype.calculateHeuristic = function(tile, goal) {
    return 10 * this.distanceBetween(tile, goal);
}

AStarMap.prototype.getNeighbors = function(currentNode) {
    var neighbors = [];

    var x = currentNode.x;
    var y = currentNode.y;

    var xMinusOne = this.tiles[x-1];
    if (xMinusOne) {
        if (xMinusOne[y-1]) {
            neighbors.push(xMinusOne[y-1]);
        }
        if (xMinusOne[y]) {
            neighbors.push(xMinusOne[y]);
        }
        if (xMinusOne[y+1]) {
            neighbors.push(xMinusOne[y+1]);
        }
    }
    var xPlusZero = this.tiles[x];
    if (xPlusZero) {
        if (xPlusZero[y-1]) {
            neighbors.push(xPlusZero[y-1]);
        }
        if (xPlusZero[y+1]) {
            neighbors.push(xPlusZero[y+1]);
        }
    }
    var xPlusOne = this.tiles[x+1];
    if (xPlusOne) {
        if (xPlusOne[y-1]) {
            neighbors.push(xPlusOne[y-1]);
        }
        if (xPlusOne[y]) {
            neighbors.push(xPlusOne[y]);
        }
        if (xPlusOne[y+1]) {
            neighbors.push(xPlusOne[y+1]);
        }
    }

    Util.shuffleArray(neighbors);

    return neighbors;
}