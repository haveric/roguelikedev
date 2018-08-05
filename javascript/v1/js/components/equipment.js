"use strict";

var Equipment = function() {
    this.items = {};
    this.items[EquipmentSlot.MAIN_HAND] = null;
    this.items[EquipmentSlot.OFF_HAND] = null;
}

Equipment.prototype.getAllItems = function() {
    return Object.values(this.items);
}

Equipment.prototype.isEquipped = function(itemToCheck) {
    var isEquipped = false;

    for (var item of this.getAllItems()) {
        if (item == itemToCheck) {
            isEquipped = true;
            break;
        }
    }

    return isEquipped;
}

Equipment.prototype.isEquippedSlot = function(itemToCheck, slotType) {
    var isEquipped = false;

    if (this.items[slotType] == itemToCheck) {
        isEquipped = true;
    }

    return isEquipped;
}

Equipment.prototype.toggleEquip = function(item) {
    var results = [];

    var slotType = item.equippable.slotType;

    var itemToSwap = this.items[slotType];

    if (itemToSwap) {
        results.push({"dequipped": itemToSwap});
    }

    if (itemToSwap == item) {
        this.items[slotType] = null;
    } else {
        this.items[slotType] = item;
        results.push({"equipped": item});
    }

    return results;
}

Equipment.prototype.getMaxHpBonus = function() {
    var bonus = 0;

    for (var item of this.getAllItems()) {
        if (item) {
            bonus += item.equippable.maxHpBonus;
        }
    }

    return bonus;
}

Equipment.prototype.getPowerBonus = function() {
    var bonus = 0;

    for (var item of this.getAllItems()) {
        if (item) {
            bonus += item.equippable.powerBonus;
        }
    }

    return bonus;
}

Equipment.prototype.getDefenseBonus = function() {
    var bonus = 0;

    for (var item of this.getAllItems()) {
        if (item) {
            bonus += item.equippable.defenseBonus;
        }
    }

    return bonus;
}

Equipment.prototype.getLightRadiusBonus = function() {
    var bonus = 0;

    for (var item of this.getAllItems()) {
        if (item) {
            bonus += item.equippable.lightRadiusBonus;
        }
    }

    return bonus;
}

Equipment.prototype.getMagicBonus = function() {
    var bonus = 0;

    for (var item of this.getAllItems()) {
        if (item) {
            bonus += item.equippable.magicBonus;
        }
    }

    return bonus;
}