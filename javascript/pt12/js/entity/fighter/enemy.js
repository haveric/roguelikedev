"use strict";

var Enemy = function(x, y, hp, defense, power, xp) {
    Fighter.call(this, x, y, hp, defense, power, xp);
}
Enemy.prototype = new Fighter();
Enemy.prototype.constructor = Enemy;