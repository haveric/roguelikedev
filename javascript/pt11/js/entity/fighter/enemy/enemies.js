"use strict";

var Orc = function(x, y) {
    var hp = 10;
    var defense = 0;
    var power = 3;
    var xp = 35;
    Enemy.call(this, x, y, hp, defense, power, xp);
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
    var xp = 100;
    Enemy.call(this, x, y, hp, defense, power, xp);
    this.character = "T";
    this.color = "#008000";
    this.name = "Troll";
    this.ai = new BasicMonster();
}
Troll.prototype = new Enemy();
Troll.prototype.constructor = Troll;