"use strict";

var Fighter = function(x, y, hp, defense, power, xp) {
    Entity.call(this, x, y);
    this.renderOrder = RenderOrder.ACTOR;
    this.blocks = true;

    this.maxHp = hp;
    this.hp = hp;
    this.defense = defense;
    this.power = power;
    this.xp = xp || 0;
    this.equipment = null;

    this.lightRadius = 5;
}
Fighter.prototype = new Entity();
Fighter.prototype.constructor = Fighter;

Fighter.prototype.getMaxHp = function() {
    var bonus = 0;
    if (this.equipment) {
        bonus += this.equipment.getMaxHpBonus();
    }

    return this.maxHp + bonus;
}

Fighter.prototype.getPower = function() {
    var bonus = 0;
    if (this.equipment) {
        bonus += this.equipment.getPowerBonus();
    }

    return this.power + bonus;
}

Fighter.prototype.getDefense = function() {
    var bonus = 0;
    if (this.equipment) {
        bonus += this.equipment.getDefenseBonus();
    }

    return this.defense + bonus;
}

Fighter.prototype.getLightRadius = function() {
    var bonus = 0;
    if (this.equipment) {
        bonus += this.equipment.getLightRadiusBonus();
    }

    return this.lightRadius + bonus;
}

Fighter.prototype.takeDamage = function(damage) {
    var results = [];

    this.hp -= damage;

    if (this.hp <= 0) {
        results.push({"dead": this, "xp": this.xp});
    }

    return results;
}

Fighter.prototype.attack = function(target) {
    var results = [];

    var critRoll = Random.getInt(1, 20);

    var damage = 0;

    var attackType = "";
    var color = "#ffffff";
    if (critRoll == 20) {
        var majorCritRoll = Random.getInt(1, 20);
        if (majorCritRoll == 20) {
            damage = Random.getInt(Math.floor(this.getPower()*1.5), Math.floor(this.getPower() * 2.5)) - target.getDefense();
            damage = Math.max(5, damage);
            attackType = " critically";
            color = "#ff0000";
        } else {
            damage = Random.getInt(this.getPower() + 1, this.getPower() * 2) - target.getDefense();
            damage = Math.max(2, damage);
            attackType = " strongly";
            color = "#ff7f00";
        }

    } else if (critRoll == 0) {
        damage = Random.getInt(0, this.getPower()) - target.getDefense();
        attackType = " weakly";
    } else {
        damage = this.getPower() - target.getDefense();
    }

    if (damage > 0) {
        results.push({"message": new Message("{0}{1} attacks {2} for {3} hit points.".format(this.name.toUpperCase(), attackType, target.name, damage), color)});
        results = results.concat(target.takeDamage(damage));
    } else {
        results.push({"message": new Message("{0}{1} attacks {2} but does no damage.".format(this.name.toUpperCase(), attackType, target.name), color)});
    }

    return results;
}

Fighter.prototype.heal = function(amount) {
    this.hp += amount;

    if (this.hp > this.getMaxHp()) {
        this.hp = this.getMaxHp();
    }
}