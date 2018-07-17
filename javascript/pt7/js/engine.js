"use strict";

;(function() {
    var canvasState = new CanvasState("gameCanvas", 800, 500);
    var input = new Input(canvasState);
    var asciiMap = new AsciiMap();


    var SCREEN_WIDTH = 80;
    var SCREEN_HEIGHT = 50;
    var mapWidth = 80;
    var mapHeight = 43;

    var barWidth = 200;
    var panelHeight = 7;
    var panelY = (SCREEN_HEIGHT - panelHeight) * asciiMap.letterHeight;

    var messageX = 220;
    var messageY = 440;
    var messageWidth = 800 - messageX;
    var messageMaxLines = 6;

    var roomMinSize = 6;
    var roomMaxSize = 10;
    var maxRooms = 30;

    var fovLightWalls = true;
    var fovRadius = 10;
    var fovRecompute = true;

    var maxMonstersPerRoom = 3;

    var entities = new Entities();
    var fighterComponent = new Fighter(30, 2, 5);
    var player = new Entity(0, 0, '@', "#ffffff", "Player", true, RenderOrder.ACTOR, fighterComponent);

    entities.add(player);

    var gameMap = new GameMap(mapWidth, mapHeight);
    gameMap.makeMap(maxRooms, roomMinSize, roomMaxSize, mapWidth, mapHeight, player, entities, maxMonstersPerRoom);

    var fovMap = new FovMap(gameMap);

    var messageLog = new MessageLog(messageX, messageY, messageWidth, messageMaxLines);

    var gameState = GameStates.PLAYERS_TURN;

    function main() {
        window.requestAnimationFrame(main);

        update();
        render();
    }

    function update() {
        handleInput();

        if (gameState == GameStates.ENEMY_TURN) {

            for (var entity of entities.entities) {
                if (entity.ai) {
                    var enemyTurnResults = entity.ai.takeTurn(player, fovMap, gameMap, entities);

                    for (var enemyTurnResult of enemyTurnResults) {
                        var message = enemyTurnResult.message;
                        var deadEntity = enemyTurnResult.dead;

                        if (message) {
                            messageLog.addMessage(message);
                        }

                        if (deadEntity) {
                            if (deadEntity == player) {
                                message = killPlayer(deadEntity);
                                gameState = GameStates.PLAYER_DEAD;
                            } else {
                                message = killMonster(deadEntity);
                            }

                            messageLog.addMessage(message);

                            if (gameState == GameStates.PLAYER_DEAD) {
                                break;
                            }
                        }
                    }

                    if (gameState == GameStates.PLAYER_DEAD) {
                        break;
                    }
                }
            }

            if (gameState != GameStates.PLAYER_DEAD) {
                gameState = GameStates.PLAYERS_TURN;
            }
        }
    }

    function render() {
        canvasState.clear("#000");

        if (fovRecompute) {
            fovMap.computeFov(player.x, player.y, fovRadius, fovLightWalls);
        }
        entities.renderAll(asciiMap, gameMap, fovMap, canvasState);

        renderBar(canvasState, 10, panelY, barWidth, "HP", player.fighter.hp, player.fighter.maxHp, "#FF7373", "#BF0000");

        var names = entities.getNamesUnderMouse(input.mousePosition, fovMap, canvasState.scale);
        if (names != "") {
            drawText(canvasState, names, 10, panelY - 10, "#E4E4E4", "start", "middle");
        }

        messageLog.render(canvasState);


        fovRecompute = false;
    }

    function handleInput() {
        // Movement
        if (input.isPressed(Key.LEFT) || input.isPressed(Key.NUMPAD4)) {
            handleMove(-1, 0);
            input.removeKey(Key.LEFT);
            input.removeKey(Key.NUMPAD4);
        } else if (input.isPressed(Key.RIGHT) || input.isPressed(Key.NUMPAD6)) {
            handleMove(1, 0);
            input.removeKey(Key.RIGHT);
            input.removeKey(Key.NUMPAD6);
        } else if (input.isPressed(Key.UP) || input.isPressed(Key.NUMPAD8)) {
            handleMove(0, -1);
            input.removeKey(Key.UP);
            input.removeKey(Key.NUMPAD8);
        } else if (input.isPressed(Key.DOWN) || input.isPressed(Key.NUMPAD2)) {
            handleMove(0, 1);
            input.removeKey(Key.DOWN);
            input.removeKey(Key.NUMPAD2);
        } else if (input.isPressed(Key.NUMPAD7)) {
            handleMove(-1, -1);
            input.removeKey(Key.NUMPAD7);
        } else if (input.isPressed(Key.NUMPAD9)) {
            handleMove(1, -1);
            input.removeKey(Key.NUMPAD9);
        } else if (input.isPressed(Key.NUMPAD1)) {
            handleMove(-1, 1);
            input.removeKey(Key.NUMPAD1);
        } else if (input.isPressed(Key.NUMPAD3)) {
            handleMove(1, 1);
            input.removeKey(Key.NUMPAD3);
        }

        // Toggle "fullscreen" scale
        if (input.isPressed(Key.ENTER) && input.isPressed(Key.ALT)) {
            canvasState.toggleScale();
            input.removeKey(Key.ENTER);
        }
    }

    function handleMove(x, y) {
        var playerTurnResults = [];

        var destX = player.x + x;
        var destY = player.y + y;
        if (gameState == GameStates.PLAYERS_TURN && !gameMap.isBlocked(destX, destY)) {
            var target = entities.getBlockingEntitiesAtLocation(destX, destY);

            if (target != null) {
                var attackResults = player.fighter.attack(target);
                playerTurnResults = playerTurnResults.concat(attackResults);
            } else {
                player.move(gameMap, x, y);
                fovRecompute = true;
            }

            gameState = GameStates.ENEMY_TURN
        }

        for (var playerTurnResult of playerTurnResults) {
            var message = playerTurnResult.message;
            var deadEntity = playerTurnResult.dead;

            if (message) {
                messageLog.addMessage(message);
            }

            if (deadEntity) {
                if (deadEntity == player) {
                    message = killPlayer(deadEntity);
                    gameState = GameStates.PLAYER_DEAD;
                } else {
                    message = killMonster(deadEntity);
                }

                messageLog.addMessage(message);
            }
        }
    }

    main();
})();