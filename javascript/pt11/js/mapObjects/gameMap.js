"use strict";

var GameMap = function(width, height, dungeonLevel) {
    this.maxRooms = 30;
    this.roomMinSize = 6;
    this.roomMaxSize = 10;

    this.width = width;
    this.height = height;
    this.dungeonLevel = dungeonLevel;

    this.tiles = this.initTiles();
}

GameMap.prototype.initTiles = function() {
    var tiles = Util.create2dArray(this.width);

    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            tiles[i][j] = new Tile(true);
        }
    }

    return tiles;
}

GameMap.prototype.makeMap = function(mapWidth, mapHeight, player, entities, maxMonstersPerRoom, maxItemsPerRoom) {
    var rooms = [];
    var numRooms = 0;

    var lastRoomCenterX;
    var lastRoomCenterY;

    for (var i = 0; i < this.maxRooms; i++) {
        var width = Util.getRandomInt(this.roomMinSize, this.roomMaxSize);
        var height = Util.getRandomInt(this.roomMinSize, this.roomMaxSize);

        var x = Util.getRandomInt(0, mapWidth - width - 1);
        var y = Util.getRandomInt(0, mapHeight - height - 1);

        var newRoom = new Rect(x, y, width, height);

        var intersects = false;
        for (var room of rooms) {
            if (room.intersects(newRoom)) {
                intersects = true;
                break;
            }
        }

        if (!intersects) {
            var newX = newRoom.getCenterX();
            var newY = newRoom.getCenterY();

            lastRoomCenterX = newX;
            lastRoomCenterY = newY;

            this.createRoom(newRoom);

            if (numRooms == 0) {
                // this is the first room, where we'll put the player to start atan
                player.x = newX;
                player.y = newY;
            } else {
                // all rooms after the first
                // connect this room to the previous with a tunnel

                var prevRoom = rooms[numRooms - 1];
                var prevX = prevRoom.getCenterX();
                var prevY = prevRoom.getCenterY();

                if (Util.getRandomInt(0, 1) == 1) {
                    // horizontal first, then vertical
                    this.createHorizontalTunnel(prevX, newX, prevY);
                    this.createVerticalTunnel(prevY, newY, newX);
                } else {
                    // vertical first, then horizontal
                    this.createVerticalTunnel(prevY, newY, prevX);
                    this.createHorizontalTunnel(prevX, newX, newY);
                }
            }

            this.placeEntities(newRoom, entities, maxMonstersPerRoom, maxItemsPerRoom);

            rooms.push(newRoom);
            numRooms += 1;
        }
    }

    var stairs = new Stairs(lastRoomCenterX, lastRoomCenterY);
    entities.add(stairs);
}

GameMap.prototype.createRoom = function(roomRect) {
    for (var x = roomRect.x1 + 1; x < roomRect.x2; x++) {
        for (var y = roomRect.y1 + 1; y < roomRect.y2; y++) {
            this.tiles[x][y].setBlocked(false);
        }
    }
}

GameMap.prototype.createHorizontalTunnel = function(x1, x2, y) {
    for (var x = Math.min(x1, x2); x < Math.max(x1, x2) + 1; x++) {
        this.tiles[x][y].setBlocked(false);
    }
}

GameMap.prototype.createVerticalTunnel = function(y1, y2, x) {
    for (var y = Math.min(y1, y2); y < Math.max(y1, y2) + 1; y++) {
        this.tiles[x][y].setBlocked(false);
    }
}

GameMap.prototype.placeEntities = function(room, entities, maxMonstersPerRoom, maxItemPerRoom) {
    var numMonsters = Util.getRandomInt(0, maxMonstersPerRoom);
    var numItems = Util.getRandomInt(0, maxItemPerRoom)

    for (var i = 0; i < numMonsters; i++) {
        // Choose a random location in the room
        var x = Util.getRandomInt(room.x1 + 1, room.x2 - 1);
        var y = Util.getRandomInt(room.y1 + 1, room.y2 - 1);

        var entityExistsAtLocation = false;
        for (var entity of entities.entities) {
            if (entity.x == x && entity.y == y) {
                entityExistsAtLocation = true;
                break;
            }
        }

        if (!entityExistsAtLocation) {
            var monster;
            if (Util.getRandomInt(0, 100) < 80) {
                monster = new Orc(x, y);
            } else {
                monster = new Troll(x, y);
            }

            entities.add(monster);
        }
    }

    for (var i = 0; i < maxItemPerRoom; i++) {
        // Choose a random location in the room
        var x = Util.getRandomInt(room.x1 + 1, room.x2 - 1);
        var y = Util.getRandomInt(room.y1 + 1, room.y2 - 1);

        var entityExistsAtLocation = false;
        for (var entity of entities.entities) {
            if (entity.x == x && entity.y == y) {
                entityExistsAtLocation = true;
                break;
            }
        }

        if (!entityExistsAtLocation) {
            var itemChance = Util.getRandomInt(0, 100);
            var item;

            if (itemChance < 70) {
                item = new HealingPotion(x, y);
            } else if (itemChance < 80) {
                item = new FireballScroll(x, y);
            } else if (itemChance < 90) {
                item = new ConfusionScroll(x, y);
            } else {
                item = new LightningScroll(x, y);
            }

            entities.add(item);
        }
    }
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