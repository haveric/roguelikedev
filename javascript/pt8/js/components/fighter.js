"use strict";

var Fighter = function(hp, defense, power) {
    this.owner = null;
    this.maxHp = hp;
    this.hp = hp;
    this.defense = defense;
    this.power = power;
}

Fighter.prototype.takeDamage = function(damage) {
    var results = [];

    this.hp -= damage;

    if (this.hp <= 0) {
        results.push({"dead": this.owner});
    }

    return results;
}

Fighter.prototype.attack = function(target) {
    var results = [];

    var damage = this.power - target.fighter.defense;

    if (damage > 0) {
        results.push({"message": new Message("{0} attacks {1} for {2} hit points.".format(this.owner.name.toUpperCase(), target.name, damage), "#ffffff")});
        results = results.concat(target.fighter.takeDamage(damage));
    } else {
        results.push({"message": new Message("{0} attacks {1} but does no damage.".format(this.owner.name.toUpperCase(), target.name), "#ffffff")});
    }

    return results;
}

Fighter.prototype.heal = function(amount) {
    this.hp += amount;

    if (this.hp > this.maxHp) {
        this.hp = this.maxHp;
    }
}