"use strict";

;(function() {
    var canvasState = new CanvasState("gameCanvas", 560, 450);
    var input = new Input();
    var asciiMap = new AsciiMap();


    var SCREEN_WIDTH = 80;
    var SCREEN_HEIGHT = 50;
    var mapWidth = 80;
    var mapHeight = 45;

    var roomMinSize = 6;
    var roomMaxSize = 10;
    var maxRooms = 30;

	var fovLightWalls = true;
	var fovRadius = 10;
	var fovRecompute = true;

	var maxMonstersPerRoom = 3;

    var entities = new Entities();
    var player = new Entity(0, 0, '@', "#ffffff", "Player", true);

    entities.add(player);

    var gameMap = new GameMap(mapWidth, mapHeight);
    gameMap.makeMap(maxRooms, roomMinSize, roomMaxSize, mapWidth, mapHeight, player, entities, maxMonstersPerRoom);

	var fovMap = new FovMap(gameMap);

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
				if (entity != player) {
					console.log("The " + entity.name + " ponders the meaning of its existence.");
				}
			}

			gameState = GameStates.PLAYERS_TURN;
		}
    }

    function render() {
        canvasState.clear("#000");

		if (fovRecompute) {
			fovMap.computeFov(player.x, player.y, fovRadius, fovLightWalls);
		}
        entities.renderAll(asciiMap, gameMap, fovMap, canvasState);

		fovRecompute = false;
    }

    function handleInput() {
        // Movement
        if (input.isPressed(Key.LEFT)) {
			handleMove(-1, 0);
            input.removeKey(Key.LEFT);
        } else if (input.isPressed(Key.RIGHT)) {
            handleMove(1, 0);
            input.removeKey(Key.RIGHT);
        } else if (input.isPressed(Key.UP)) {
            handleMove(0, -1);
            input.removeKey(Key.UP);
        } else if (input.isPressed(Key.DOWN)) {
            handleMove(0, 1);
            input.removeKey(Key.DOWN);
        }

        // Toggle "fullscreen" scale
        if (input.isPressed(Key.ENTER) && input.isPressed(Key.ALT)) {
            canvasState.toggleScale();
            input.removeKey(Key.ENTER);
        }
    }

	function handleMove(x, y) {
		var destX = player.x + x;
		var destY = player.y + y;
		if (gameState == GameStates.PLAYERS_TURN && !gameMap.isBlocked(destX, destY)) {
			var target = entities.getBlockingEntitiesAtLocation(destX, destY);

			if (target != null) {
				console.log("You kick the " + target.name + " in the shins, much to its annoyance!");
			} else {
				player.move(gameMap, x, y);
				fovRecompute = true;
			}

			gameState = GameStates.ENEMY_TURN
		}
	}

    main();
})();