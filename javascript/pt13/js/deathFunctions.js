"use strict";

function killPlayer(player) {
    player.character = "%";
    player.color = "#BF0000";

    return new Message("You died!", "#FF0000");
}

function killMonster(monster) {
    var deathMessage = new Message("{0} is dead!".format(monster.name.toUpperCase()), "#FF7F00");

    monster.character = "%";
    monster.color = "#BF0000";
    monster.blocks = false;
    monster.ai = null;
    monster.name = "remains of " + monster.name;
    monster.renderOrder = RenderOrder.CORPSE;

    return deathMessage;
}