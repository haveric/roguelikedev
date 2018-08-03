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

var Fighter = function(x, y, hp, defense, power) {
    Entity.call(this, x, y);
    this.renderOrder = RenderOrder.ACTOR;
    this.blocks = true;

    this.maxHp = hp;
    this.hp = hp;
    this.defense = defense;
    this.power = power;

    this.lightRadius = 10;
}
Fighter.prototype = new Entity();
Fighter.prototype.constructor = Fighter;

Fighter.prototype.takeDamage = function(damage) {
    var results = [];

    this.hp -= damage;

    if (this.hp <= 0) {
        results.push({"dead": this});
    }

    return results;
}

Fighter.prototype.attack = function(target) {
    var results = [];

    var damage = this.power - target.defense;

    if (damage > 0) {
        results.push({"message": new Message("{0} attacks {1} for {2} hit points.".format(this.name.toUpperCase(), target.name, damage), "#ffffff")});
        results = results.concat(target.takeDamage(damage));
    } else {
        results.push({"message": new Message("{0} attacks {1} but does no damage.".format(this.name.toUpperCase(), target.name), "#ffffff")});
    }

    return results;
}

Fighter.prototype.heal = function(amount) {
    this.hp += amount;

    if (this.hp > this.maxHp) {
        this.hp = this.maxHp;
    }
}

var Player = function(x, y, hp, defense, power) {
    hp = hp || 30;
    defense = defense || 2;
    power = power || 5;
    Fighter.call(this, x, y, hp, defense, power);
    this.character = "@";
    this.color = "#ffffff";
    this.name = "Player";
    this.inventory = new Inventory(26);
}
Player.prototype = new Fighter();
Player.prototype.constructor = Player;



var Enemy = function(x, y, hp, defense, power) {
    Fighter.call(this, x, y, hp, defense, power);
}
Enemy.prototype = new Fighter();
Enemy.prototype.constructor = Enemy;

var Orc = function(x, y) {
    var hp = 10;
    var defense = 0;
    var power = 3;
    Enemy.call(this, x, y, hp, defense, power);
    this.character = "o";
    this.color = "#408040";
    this.name = "Orc";
    this.ai = new BasicMonster();
}
Orc.prototype = new Enemy();
Orc.prototype.constructor = Orc;

var Troll = function(x, y) {
    var hp = 16;
    var defense = 1;
    var power = 4;
    Enemy.call(this, x, y, hp, defense, power);
    this.character = "T";
    this.color = "#008000";
    this.name = "Troll";
    this.ai = new BasicMonster();
}
Troll.prototype = new Enemy();
Troll.prototype.constructor = Troll;



var Item = function(x, y, useFunction, targeting, targetingMessage, args) {
    Entity.call(this, x, y);
    this.renderOrder = RenderOrder.ITEM;
    this.blocks = false;
    this.useFunction = useFunction || "";
    this.targeting = targeting || false;
    this.targetingMessage = targetingMessage || null;
    this.functionArgs = args;
}
Item.prototype = new Entity();
Item.prototype.constructor = Item;

Item.prototype.callUseFunction = function(args) {
    switch(this.useFunction) {
        case "heal":
            return heal(args);
            break;
        case "castFireball":
            return castFireball(args);
            break;
        case "castConfuse":
            return castConfuse(args);
            break;
        case "castLightning":
            return castLightning(args);
            break;
        default:
            return "";
            break;
    }
}

var HealingPotion = function(x, y) {
    Item.call(this, x, y);
    this.character = "!";
    this.color = "#7F00FF";
    this.name = "Healing Potion";
    this.useFunction = "heal";
    this.functionArgs = {"amount": 4};
}
HealingPotion.prototype = new Item();
HealingPotion.prototype.constructor = HealingPotion;

var FireballScroll = function(x, y) {
    Item.call(this, x, y);
    this.character = "#";
    this.color = "#FF0000";
    this.name = "Fireball Scroll";
    this.useFunction = "castFireball";
    this.targeting = true;
    this.targetingMessage = new Message("Left click a target tile for the fireball, or right click to cancel.", "#73FFFF");
    this.functionArgs = {"damage": 12, "radius": 3};
}
FireballScroll.prototype = new Item();
FireballScroll.prototype.constructor = FireballScroll;

var ConfusionScroll = function(x, y) {
    Item.call(this, x, y);
    this.character = "#";
    this.color = "#FF73B9";
    this.name = "Confusion Scroll";
    this.useFunction = "castConfuse";
    this.targeting = true;
    this.targetingMessage = new Message("Left click an enemy to confuse it, or right click to cancel.", "#73FFFF");
}
ConfusionScroll.prototype = new Item();
ConfusionScroll.prototype.constructor = ConfusionScroll;

var LightningScroll = function(x, y) {
    Item.call(this, x, y);
    this.character = "#";
    this.color = "#FFFF00";
    this.name = "Lightning Scroll";
    this.useFunction = "castLightning";
    this.functionArgs = {"damage": 20, "maxRange": 5};
}
LightningScroll.prototype = new Item();
LightningScroll.prototype.constructor = LightningScroll;