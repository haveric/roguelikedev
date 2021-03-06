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