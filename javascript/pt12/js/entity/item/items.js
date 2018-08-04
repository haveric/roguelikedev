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