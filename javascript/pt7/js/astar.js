"use strict";

var AStarTile = function(x, y, blocked) {
    this.blocked = blocked;
    this.x = x;
    this.y = y;

    this.f = null;
    this.g = null;
    this.parent = null;
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

    var closed = [];

    var open = [];
    open.push(start);

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

        closed.push(currentNode);

        var neighbors = this.getNeighbors(currentNode);

        for (var neighbor of neighbors) {
            if (closed.indexOf(neighbor) > -1 || neighbor.blocked) {
                continue;
            }

            var g = currentNode.g + this.distanceBetween(currentNode, neighbor);

            if (open.indexOf(neighbor) == -1) {
                open.push(neighbor);
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
    var xDist = Math.abs(tile1.x - tile2.x);
    var yDist = Math.abs(tile1.y - tile2.y);

    return Math.max(xDist, yDist);
}

AStarMap.prototype.calculateHeuristic = function(tile, goal) {
    return 10 * this.distanceBetween(tile, goal);
}

AStarMap.prototype.getNeighbors = function(currentNode) {
    var neighbors = [];

    var x = currentNode.x;
    var y = currentNode.y;

    if (this.tiles[x-1]) {
        if (this.tiles[x-1][y-1]) {
            neighbors.push(this.tiles[x-1][y-1]);
        }
        if (this.tiles[x-1][y]) {
            neighbors.push(this.tiles[x-1][y]);
        }
        if (this.tiles[x-1][y+1]) {
            neighbors.push(this.tiles[x-1][y+1]);
        }
    }
    if (this.tiles[x]) {
        if (this.tiles[x][y-1]) {
            neighbors.push(this.tiles[x][y-1]);
        }
        if (this.tiles[x][y+1]) {
            neighbors.push(this.tiles[x][y+1]);
        }
    }
    if (this.tiles[x+1]) {
        if (this.tiles[x+1][y-1]) {
            neighbors.push(this.tiles[x+1][y-1]);
        }
        if (this.tiles[x+1][y]) {
            neighbors.push(this.tiles[x+1][y]);
        }
        if (this.tiles[x+1][y+1]) {
            neighbors.push(this.tiles[x+1][y+1]);
        }
    }

    Util.shuffleArray(neighbors);

    return neighbors;

}