function getConstants(asciiMap) {
    var screenWidth = 80;
    var screenHeight = 50;
    var panelHeight = 7;
    return {
        SCREEN_WIDTH: 80,
        SCREEN_HEIGHT: 50,
        HP_BAR_WIDTH: 200,
        PANEL_HEIGHT: 7,
        PANEL_Y: (screenHeight - panelHeight) * asciiMap.letterHeight,
        MAP_WIDTH: screenWidth,
        MAP_HEIGHT: screenHeight - panelHeight,
        FOV_LIGHT_WALLS: true,
        MAX_MONSTERS_PER_ROOM: 3,
        MAX_ITEMS_PER_ROOM: 2
    }
}

function getGameVariables(constants) {
    var entities = new Entities();

    var player = new Player(0, 0);

    entities.add(player);

    var gameMap = new GameMap(constants.MAP_WIDTH, constants.MAP_HEIGHT);
    gameMap.makeMap(constants.MAP_WIDTH, constants.MAP_HEIGHT, player, entities, constants.MAX_MONSTERS_PER_ROOM, constants.MAX_ITEMS_PER_ROOM);

    var messageLog = new MessageLog();

    var gameState = GameStates.PLAYERS_TURN;

    return {
        "player": player,
        "entities": entities,
        "gameMap": gameMap,
        "messageLog": messageLog,
        "gameState": gameState
    }
}