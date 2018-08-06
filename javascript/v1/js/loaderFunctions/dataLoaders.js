"use strict";

var necromancer = new Resurrect();

function saveGame(player, entities, gameMap, messageLog, gameState) {
    var playerIndex = entities.entities.indexOf(player);

    var save = {
        "playerIndex": playerIndex,
        "entitiesList": entities.entities,
        "gameMap": gameMap,
        "messageLog": messageLog,
        "gameState": gameState
    }

    localStorage.setItem("savegame", necromancer.stringify(save));
}

function loadGame() {
    var savegame = localStorage.getItem("savegame");

    var load = null;
    if (savegame) {
        load = necromancer.resurrect(savegame);

        var playerIndex = load.playerIndex;
        var entities = new Entities();
        entities.entities = load.entitiesList;

        var player = entities.entities[playerIndex];

        load.entities = entities;
        load.player = player;
    }

    return load;
}