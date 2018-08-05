"use strict";

var HealingPotion = function(x, y) {
    Item.call(this, x, y);
    this.character = "!";
    this.color = "#7F00FF";
    this.name = "Healing Potion";
    this.useFunction = "heal";
    this.functionArgs = {"amount": 40};
}
HealingPotion.prototype = new Item();
HealingPotion.prototype.constructor = HealingPotion;

var FireballScroll = function(x, y) {
    Item.call(this, x, y);
    this.character = "#";
    this.color = "#FF0000";
    this.name = "Fireball Scroll";
    this.useFunction = "castFireball";
    this.targeting = true;
    this.targetingMessage = new Message("Left click a target tile for the fireball, or right click to cancel.", "#73FFFF");
    this.functionArgs = {"damage": 25, "radius": 3};
}
FireballScroll.prototype = new Item();
FireballScroll.prototype.constructor = FireballScroll;

var ConfusionScroll = function(x, y) {
    Item.call(this, x, y);
    this.character = "#";
    this.color = "#FF73B9";
    this.name = "Confusion Scroll";
    this.useFunction = "castConfuse";
    this.targeting = true;
    this.targetingMessage = new Message("Left click an enemy to confuse it, or right click to cancel.", "#73FFFF");
}
ConfusionScroll.prototype = new Item();
ConfusionScroll.prototype.constructor = ConfusionScroll;

var LightningScroll = function(x, y) {
    Item.call(this, x, y);
    this.character = "#";
    this.color = "#FFFF00";
    this.name = "Lightning Scroll";
    this.useFunction = "castLightning";
    this.functionArgs = {"damage": 40, "maxRange": 5};
}
LightningScroll.prototype = new Item();
LightningScroll.prototype.constructor = LightningScroll;

var Dagger = function(x, y) {
    Item.call(this, x, y);
    this.character = "-";
    this.color = "#00BFFF";
    this.name = "Dagger";
    this.equippable = new Equippable(EquipmentSlot.MAIN_HAND, 2);
}
Dagger.prototype = new Item();
Dagger.prototype.constructor = Dagger;

var Sword = function(x, y) {
    Item.call(this, x, y);
    this.character = "/";
    this.color = "#00BFFF";
    this.name = "Sword";
    this.equippable = new Equippable(EquipmentSlot.MAIN_HAND, 3);
}
Sword.prototype = new Item();
Sword.prototype.constructor = Sword;

var Shield = function(x, y) {
    Item.call(this, x, y);
    this.character = "[";
    this.color = "#804000";
    this.name = "Shield";
    this.equippable = new Equippable(EquipmentSlot.OFF_HAND, 0, 1);
}
Shield.prototype = new Item();
Shield.prototype.constructor = Shield;

var Torch = function(x, y) {
    Item.call(this, x, y);
    this.character = "¡";
    this.color = "#ffb732";
    this.name = "Torch";
    this.equippable = new Equippable(EquipmentSlot.OFF_HAND, 0, 0, 0, 7);
}
Torch.prototype = new Item();
Torch.prototype.constructor = Torch;

var RingOfLight = function(x, y) {
    Item.call(this, x, y);
    this.character = "o";
    this.color = "#ffb732";
    this.name = "Ring of Light";
    this.equippable = new Equippable(EquipmentSlot.RING, 0, 0, 0, 2);
}
RingOfLight.prototype = new Item();
RingOfLight.prototype.constructor = RingOfLight;

var RingOfHealth = function(x, y) {
    Item.call(this, x, y);
    this.character = "o";
    this.color = "#cc0000";
    this.name = "Ring of Health";
    this.equippable = new Equippable(EquipmentSlot.RING, 0, 0, 20);
}
RingOfHealth.prototype = new Item();
RingOfHealth.prototype.constructor = RingOfHealth;

var RingOfMagic = function(x, y) {
    Item.call(this, x, y);
    this.character = "o";
    this.color = "#0000cc";
    this.name = "Ring of Magic";
    this.equippable = new Equippable(EquipmentSlot.RING, 0, 0, 0, 0, 1);
}
RingOfMagic.prototype = new Item();
RingOfMagic.prototype.constructor = RingOfMagic;