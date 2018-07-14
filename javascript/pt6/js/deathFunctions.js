"use strict";

function killPlayer(player) {
    player.character = "%";
    player.color = "#BF0000";

    return "You died!";
}

function killMonster(monster) {
    var deathMessage = "{0} is dead!".format(monster.name.toUpperCase());

    monster.character = "%";
    monster.color = "#BF0000";
    monster.blocks = false;
    monster.fighter = null;
    monster.ai = null;
    monster.name = "remains of " + monster.name;
    monster.renderOrder = RenderOrder.CORPSE;

    return deathMessage;
}