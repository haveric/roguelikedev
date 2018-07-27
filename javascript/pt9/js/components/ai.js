"use strict";

var BasicMonster = function() {
    this.owner = null;
}

BasicMonster.prototype.takeTurn = function(target, fovMap, gameMap, entities) {
    var results = [];

    var monster = this.owner;

    if (fovMap.isPointInFov(monster.x, monster.y)) {
        if (monster.distanceTo(target) >= 2) {
            monster.moveAStar(target, entities, gameMap);
        } else if (target.fighter.hp > 0) {
            var attackResults = monster.fighter.attack(target);
            results = results.concat(attackResults);
        }
    }

    return results;
}

var ConfusedMonster = function(previousAI, numTurns) {
    this.owner = null;
    this.previousAI = previousAI;
    this.numTurns = numTurns;
}

ConfusedMonster.prototype.takeTurn = function(target, fovMap, gameMap, entities) {
    var results = [];

    if (this.numTurns > 0) {
        var randomX = this.owner.x + Util.getRandomInt(-1, 1);
        var randomY = this.owner.x + Util.getRandomInt(-1, 1);

        if (randomX != this.owner.x && randomY != this.owner.y) {
            this.owner.moveTowards(randomX, randomY, gameMap, entities);
        }

        this.numTurns -= 1;
    } else {
        this.owner.ai = this.previousAI;
        results.push({"message": new Message("The {0} is no longer confused!".format(this.owner.name), "#FF0000")});
    }

    return results;
}