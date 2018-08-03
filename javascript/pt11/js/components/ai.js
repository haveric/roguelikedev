"use strict";

var BasicMonster = function() {

}

BasicMonster.prototype.takeTurn = function(owner, target, fovMap, gameMap, entities) {
    var results = [];

    if (fovMap.isPointInFov(owner.x, owner.y)) {
        if (owner.distanceTo(target) >= 2) {
            owner.moveAStar(target, entities, gameMap);
        } else if (target.hp > 0) {
            var attackResults = owner.attack(target);
            results = results.concat(attackResults);
        }
    }

    return results;
}

var ConfusedMonster = function(previousAI, numTurns) {
    this.previousAI = previousAI;
    this.numTurns = numTurns;
}

ConfusedMonster.prototype.takeTurn = function(owner, target, fovMap, gameMap, entities) {
    var results = [];

    if (this.numTurns > 0) {
        var randomX = owner.x + Util.getRandomInt(-1, 1);
        var randomY = owner.x + Util.getRandomInt(-1, 1);

        if (randomX != owner.x && randomY != owner.y) {
            owner.moveTowards(randomX, randomY, gameMap, entities);
        }

        this.numTurns -= 1;
    } else {
        owner.ai = this.previousAI;
        results.push({"message": new Message("The {0} is no longer confused!".format(owner.name), "#FF0000")});
    }

    return results;
}