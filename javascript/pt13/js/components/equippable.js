"use strict";

var Equippable = function(slotType, powerBonus, defenseBonus, maxHpBonus) {
    this.slotType = slotType;
    this.powerBonus = powerBonus || 0;
    this.defenseBonus = defenseBonus || 0;
    this.maxHpBonus = maxHpBonus || 0;
}