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

    var entities = new Entities();
    var player = new Entity(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, '@', "#eeee00");
    var npc = new Entity(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, '@', "#fff");

    entities.add(player);
    entities.add(npc);

    var gameMap = new GameMap(mapWidth, mapHeight);
    gameMap.makeMap(maxRooms, roomMinSize, roomMaxSize, mapWidth, mapHeight, player);

    function main() {
        window.requestAnimationFrame(main);

        update();
        render();
    }

    function update() {
        handleInput();
    }

    function render() {
        canvasState.clear("#000");

        entities.renderAll(asciiMap, gameMap, canvasState);
    }

    function handleInput() {
        // Movement
        if (input.isPressed(Key.LEFT)) {
            player.move(gameMap, -1, 0);
            input.removeKey(Key.LEFT);
        } else if (input.isPressed(Key.RIGHT)) {
            player.move(gameMap, 1, 0);
            input.removeKey(Key.RIGHT);
        } else if (input.isPressed(Key.UP)) {
            player.move(gameMap, 0, -1);
            input.removeKey(Key.UP);
        } else if (input.isPressed(Key.DOWN)) {
            player.move(gameMap, 0, 1);
            input.removeKey(Key.DOWN);
        }

        // Toggle "fullscreen" scale
        if (input.isPressed(Key.ENTER) && input.isPressed(Key.ALT)) {
            canvasState.toggleScale();
            input.removeKey(Key.ENTER);
        }
    }

    main();
})();