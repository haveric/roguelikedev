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
    var maxItemsPerRoom = 2;

    var entities = new Entities();
    var fighterComponent = new Fighter(30, 2, 5);
    var inventoryComponent = new Inventory(26);
    var player = new Entity(0, 0, '@', "#ffffff", "Player", true, RenderOrder.ACTOR, fighterComponent, null, null, inventoryComponent);

    entities.add(player);

    var gameMap = new GameMap(mapWidth, mapHeight);
    gameMap.makeMap(maxRooms, roomMinSize, roomMaxSize, mapWidth, mapHeight, player, entities, maxMonstersPerRoom, maxItemsPerRoom);

    var fovMap = new FovMap(gameMap);

    var messageLog = new MessageLog(messageX, messageY, messageWidth, messageMaxLines);

    var gameState = GameStates.PLAYERS_TURN;
    var previousGameState = gameState;

    var targetingItem = null;

    function main() {
        window.requestAnimationFrame(main);

        update();
        render();
    }

    function update() {
        var actions = handleKeyInput(input, gameState);
        handleInputActions(actions);

        var mouseActions = handleMouseInput(input, canvasState);
        handleMouseActions(mouseActions);

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

    function handleInputActions(actions) {
        if (actions.move) {
            handleMove(actions.move[0], actions.move[1]);
        }

        if (actions.pickup) {
            handlePickup();
        }

        if (actions.showInventory) {
            showInventory();
        }

        if (actions.dropInventory) {
            dropInventory();
        }

        if (actions.fullscreen) {
            canvasState.toggleScale();
        }

        if (actions.escape) {
            handleEscape();
        }

        if (actions.inventoryIndex != undefined) {
            handleUseOrDropItem(actions.inventoryIndex);
        }
    }

    function handleMouseActions(actions) {
        if (actions.leftClick || actions.rightClick) {
            handleClick(actions);
        }

        // Reset clicks
        input.clearMouseClicks();
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

        if (gameState == GameStates.SHOW_INVENTORY || gameState == GameStates.DROP_INVENTORY) {
            var inventoryTitle = "";
            if (gameState == GameStates.SHOW_INVENTORY) {
                inventoryTitle = "Press the key next to an item to use it, or Esc to cancel.";
            } else if (gameState == GameStates.DROP_INVENTORY) {
                inventoryTitle = "Press the key next to an item to drop it, or Esc to cancel.";
            }

            renderInventoryMenu(canvasState, inventoryTitle, player.inventory, 500);
        }

        fovRecompute = false;
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

        handleTurnResults(playerTurnResults);
    }

    function handlePickup() {
        var playerTurnResults = [];
        if (gameState == GameStates.PLAYERS_TURN) {

            var foundItem = false;
            for (var entity of entities.entities) {
                if (entity.item && entity.x == player.x && entity.y == player.y) {
                    var pickupResults = player.inventory.addItem(entity);
                    playerTurnResults = playerTurnResults.concat(pickupResults);

                    foundItem = true;
                    break;
                }
            }

            if (!foundItem) {
                messageLog.addMessage(new Message("There is nothing here to pick up.", "#FFFF00"));
            }
        }

        handleTurnResults(playerTurnResults);
    }

    function handleUseOrDropItem(inventoryIndex) {
        if (previousGameState != GameStates.PLAYER_DEAD && inventoryIndex < player.inventory.items.length) {
            var playerTurnResults = [];

            var item = player.inventory.items[inventoryIndex];

            if (gameState == GameStates.SHOW_INVENTORY) {
                playerTurnResults = playerTurnResults.concat(player.inventory.useItem(item, {"entities": entities, "fovMap": fovMap}));
            } else if (gameState == GameStates.DROP_INVENTORY) {
                playerTurnResults = playerTurnResults.concat(player.inventory.dropItem(item));
            }

            handleTurnResults(playerTurnResults);
        }
    }

    function showInventory() {
        previousGameState = gameState;
        gameState = GameStates.SHOW_INVENTORY;
    }

    function dropInventory() {
        previousGameState = gameState;
        gameState = GameStates.DROP_INVENTORY;
    }

    function handleEscape() {
        var playerTurnResults = [];

        if (gameState == GameStates.SHOW_INVENTORY || gameState == GameStates.DROP_INVENTORY) {
            gameState = previousGameState;
        } else if (gameState == GameStates.TARGETING) {
            playerTurnResults.push({"targetingCancelled": true});
        }

        handleTurnResults(playerTurnResults);
    }

    function handleClick(actions) {
        var playerTurnResults = [];

        if (gameState == GameStates.TARGETING) {
            if (actions.leftClick) {
                var targetX = actions.leftClick[0];
                var targetY = actions.leftClick[1];

                var itemUseResults = player.inventory.useItem(targetingItem, {"entities": entities, "fovMap": fovMap, "targetX": targetX, "targetY": targetY});
                playerTurnResults = playerTurnResults.concat(itemUseResults);
            } else if (actions.rightClick) {
                playerTurnResults.push({"targetingCancelled": true});
            }
        }

        handleTurnResults(playerTurnResults);
    }


    function handleTurnResults(playerTurnResults) {
        for (var playerTurnResult of playerTurnResults) {
            var message = playerTurnResult.message;
            var deadEntity = playerTurnResult.dead;
            var itemAdded = playerTurnResult.itemAdded;
            var itemConsumed = playerTurnResult.consumed;
            var itemDropped = playerTurnResult.itemDropped;
            var targeting = playerTurnResult.targeting;
            var targetingCancelled = playerTurnResult.targetingCancelled;

            if (message) {
                messageLog.addMessage(message);
            }

            if (targetingCancelled) {
                gameState = previousGameState;
                messageLog.addMessage(new Message("Targeting cancelled"));
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

            if (itemAdded) {
                entities.remove(itemAdded);
                gameState = GameStates.ENEMY_TURN;
            }

            if (itemConsumed) {
                gameState = GameStates.ENEMY_TURN;
            }

            if (targeting) {
                previousGameState = GameStates.PLAYERS_TURN;
                gameState = GameStates.TARGETING;

                targetingItem = targeting;
                messageLog.addMessage(targetingItem.item.targetingMessage);
            }

            if (itemDropped) {
                entities.add(itemDropped);
                gameState = GameStates.ENEMY_TURN;
            }
        }
    }

    main();
})();