"use strict";

var Stairs = function(x, y) {
    Entity.call(this, x, y, ">", "#FFFFFF", "Stairs", false, RenderOrder.STAIRS, true);
}
Stairs.prototype = new Entity();
Stairs.prototype.constructor = Stairs;