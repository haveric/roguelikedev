"use strict";

var Equippable = function(slotType, powerBonus, defenseBonus, maxHpBonus, lightRadiusBonus, magicBonus) {
    this.slotType = slotType;
    this.powerBonus = powerBonus || 0;
    this.defenseBonus = defenseBonus || 0;
    this.maxHpBonus = maxHpBonus || 0;
    this.lightRadiusBonus = lightRadiusBonus || 0;
    this.magicBonus = magicBonus || 0;
}