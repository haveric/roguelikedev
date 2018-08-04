"use strict";

var Item = function(x, y, useFunction, targeting, targetingMessage, args, equippable) {
    Entity.call(this, x, y);
    this.renderOrder = RenderOrder.ITEM;
    this.blocks = false;
    this.useFunction = useFunction || "";
    this.targeting = targeting || false;
    this.targetingMessage = targetingMessage || null;
    this.functionArgs = args;
    this.equippable = equippable || null;
}
Item.prototype = new Entity();
Item.prototype.constructor = Item;

Item.prototype.callUseFunction = function(args) {
    switch(this.useFunction) {
        case "heal":
            return heal(args);
            break;
        case "castFireball":
            return castFireball(args);
            break;
        case "castConfuse":
            return castConfuse(args);
            break;
        case "castLightning":
            return castLightning(args);
            break;
        default:
            return "";
            break;
    }
}