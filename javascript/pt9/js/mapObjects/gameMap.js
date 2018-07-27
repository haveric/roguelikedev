"use strict";

var GameMap = function(width, height) {
    this.width = width;
    this.height = height;

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

GameMap.prototype.makeMap = function(maxRooms, roomMinSize, roomMaxSize, mapWidth, mapHeight, player, entities, maxMonstersPerRoom, maxItemsPerRoom) {
    var rooms = [];
    var numRooms = 0;

    for (var i = 0; i < maxRooms; i++) {
        var width = Util.getRandomInt(roomMinSize, roomMaxSize);
        var height = Util.getRandomInt(roomMinSize, roomMaxSize);

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
                var fighterComponent = new Fighter(10, 0, 3);
                var aiComponent = new BasicMonster();
                monster = new Entity(x, y, "o", "#408040", "Orc", true, RenderOrder.ACTOR, fighterComponent, aiComponent);
            } else {
                var fighterComponent = new Fighter(16, 1, 4);
                var aiComponent = new BasicMonster();
                monster = new Entity(x, y, "T", "#008000", "Troll", true, RenderOrder.ACTOR, fighterComponent, aiComponent);
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
                var itemComponent = new Item(heal, false, false, {"amount": 4});
                item = new Entity(x, y, "!", "#7F00FF", "Healing Potion", false, RenderOrder.ITEM, null, null, itemComponent);
            } else if (itemChance < 80) {
                var itemComponent = new Item(castFireball, true, new Message("Left click a target tile for the fireball, or right click to cancel.", "#73FFFF"), {"damage": 12, "radius": 3});
                item = new Entity(x, y, "#", "#FF0000", "Fireball Scroll", false, RenderOrder.ITEM, null, null, itemComponent);
            } else if (itemChance < 90) {
                var itemComponent = new Item(castConfuse, true, new Message("Left click an enemy to confuse it, or right click to cancel.", "#73FFFF"));
                item = new Entity(x, y, "#", "#FF73B9", "Confusion Scroll", false, RenderOrder.ITEM, null, null, itemComponent);
            } else {
                var itemComponent = new Item(castLightning, false, false, {"damage": 20, "maxRange": 5});
                item = new Entity(x, y, "#", "#FFFF00", "Lightning Scroll", false, RenderOrder.ITEM, null, null, itemComponent);
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