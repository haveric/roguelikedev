"use strict";

var Player = function(x, y, hp, defense, power) {
    hp = hp || 100;
    defense = defense || 1;
    power = power || 2;
    Fighter.call(this, x, y, hp, defense, power);
    this.character = "@";
    this.color = "#ffffff";
    this.name = "Player";
    this.inventory = new Inventory(26);
    this.equipment = new Equipment();

    this.level = 1;
    this.xp = 0;
}
Player.prototype = new Fighter();
Player.prototype.constructor = Player;

Player.prototype.getXpToNextLevel = function() {
    var levelUpBase = 200;
    var levelUpFactor = 150;

    return levelUpBase + (this.level * levelUpFactor);
}
Player.prototype.addXp = function(xp) {
    var leveledUp = false;
    this.xp += xp;

    var xpToNextLevel = this.getXpToNextLevel();
    if (this.xp > xpToNextLevel) {
        this.xp -= xpToNextLevel;
        this.level += 1;

        leveledUp = true;
    }

    return leveledUp;
}