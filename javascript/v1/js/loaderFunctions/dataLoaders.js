"use strict";

var necromancer = new Resurrect();

function saveGame(player, entityManager, gameMap, messageLog, gameState) {
    var playerIndex = entityManager.entities.indexOf(player);

    var save = {
        "playerIndex": playerIndex,
        "entitiesList": entityManager.entities,
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
        var entityManager = new EntityManager();
        entityManager.entities = load.entitiesList;

        var player = entityManager.entities[playerIndex];

        load.entityManager = entityManager;
        load.player = player;
    }

    return load;
}