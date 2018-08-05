"use strict";

var GameMap = function(width, height, dungeonLevel) {
    this.maxRooms = 30;
    this.roomMinSize = 6;
    this.roomMaxSize = 10;

    this.width = width;
    this.height = height;
    this.dungeonLevel = dungeonLevel || 1;

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

GameMap.prototype.makeMap = function(mapWidth, mapHeight, player, entities) {
    var rooms = [];
    var numRooms = 0;

    var lastRoomCenterX;
    var lastRoomCenterY;

    for (var i = 0; i < this.maxRooms; i++) {
        var width = Random.getInt(this.roomMinSize, this.roomMaxSize);
        var height = Random.getInt(this.roomMinSize, this.roomMaxSize);

        var x = Random.getInt(0, mapWidth - width - 1);
        var y = Random.getInt(0, mapHeight - height - 1);

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

                if (Random.getInt(0, 1) == 1) {
                    // horizontal first, then vertical
                    this.createHorizontalTunnel(prevX, newX, prevY);
                    this.createVerticalTunnel(prevY, newY, newX);
                } else {
                    // vertical first, then horizontal
                    this.createVerticalTunnel(prevY, newY, prevX);
                    this.createHorizontalTunnel(prevX, newX, newY);
                }
            }

            this.placeEntities(newRoom, entities);

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

GameMap.prototype.placeEntities = function(room, entities) {
    var maxMonstersPerRoom = Random.fromDungeonLevel([[2, 1], [3, 4], [5, 6]], this.dungeonLevel);
    var maxItemPerRoom = Random.fromDungeonLevel([[1, 1], [2, 4]], this.dungeonLevel);

    var numMonsters = Random.getInt(0, maxMonstersPerRoom);
    var numItems = Random.getInt(0, maxItemPerRoom)

    var monsterChances = {
        "orc": 80,
        "troll": Random.fromDungeonLevel([[15, 3], [30, 5], [60, 7]], this.dungeonLevel)
    };
    var itemChances = {
        "healingPotion": 35,
        "torch": Random.fromDungeonLevel([[10, 2]], this.dungeonLevel),
        "sword": Random.fromDungeonLevel([[5, 4]], this.dungeonLevel),
        "shield": Random.fromDungeonLevel([[15, 8]], this.dungeonLevel),
        "ring": Random.fromDungeonLevel([[1, 2], [2, 3], [5,4], [10,6], [20,8]], this.dungeonLevel),
        "lightningScroll": Random.fromDungeonLevel([[25, 4]], this.dungeonLevel),
        "fireballScroll": Random.fromDungeonLevel([[25, 6]], this.dungeonLevel),
        "confusionScroll": Random.fromDungeonLevel([[10, 2]], this.dungeonLevel)
    };

    var ringChances = {
        "light": 10,
        "health": 5,
        "magic": 1
    }

    for (var i = 0; i < numMonsters; i++) {
        // Choose a random location in the room
        var x = Random.getInt(room.x1 + 1, room.x2 - 1);
        var y = Random.getInt(room.y1 + 1, room.y2 - 1);

        var entityExistsAtLocation = false;
        for (var entity of entities.entities) {
            if (entity.x == x && entity.y == y) {
                entityExistsAtLocation = true;
                break;
            }
        }

        if (!entityExistsAtLocation) {
            var monsterChoice = Random.choiceFromDict(monsterChances);

            var monster;
            if (monsterChoice == "orc") {
                monster = new Orc(x, y);
            } else {
                monster = new Troll(x, y);
            }

            entities.add(monster);
        }
    }

    for (var i = 0; i < maxItemPerRoom; i++) {
        // Choose a random location in the room
        var x = Random.getInt(room.x1 + 1, room.x2 - 1);
        var y = Random.getInt(room.y1 + 1, room.y2 - 1);

        var entityExistsAtLocation = false;
        for (var entity of entities.entities) {
            if (entity.x == x && entity.y == y) {
                entityExistsAtLocation = true;
                break;
            }
        }

        if (!entityExistsAtLocation) {
            var itemChoice = Random.choiceFromDict(itemChances);

            var item;
            if (itemChoice == "healingPotion") {
                item = new HealingPotion(x, y);
            } else if (itemChoice == "torch") {
                item = new Torch(x, y);
            } else if (itemChoice == "sword") {
                item = new Sword(x, y);
            } else if (itemChoice == "shield") {
                item = new Shield(x, y);
            } else if (itemChoice == "ring") {
                var ringChoice = Random.choiceFromDict(ringChances);

                if (ringChoice == "light") {
                    item = new RingOfLight(x, y);
                } else if (ringChoice == "health") {
                    item = new RingOfHealth(x, y);
                } else if (ringChoice == "magic") {
                    item = new RingOfMagic(x, y);
                }
            } else if (itemChoice == "fireballScroll") {
                item = new FireballScroll(x, y);
            } else if (itemChoice == "confusionScroll") {
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

GameMap.prototype.nextFloor = function(player, entities, messageLog, constants) {
    this.dungeonLevel += 1;

    entities.removeAll();
    entities.add(player);
    this.tiles = this.initTiles();
    this.makeMap(constants.MAP_WIDTH, constants.MAP_HEIGHT, player, entities);

    player.heal(Math.floor(player.maxHp / 2));

    messageLog.addMessage(new Message("You take a moment to rest, and recover your strength.", "#B973FF"));
}