"use strict";

function handleKeyInput(input, gameState) {
    if (gameState == GameStates.PLAYERS_TURN) {
        return handlePlayerTurnInput(input);
    } else if (gameState == GameStates.PLAYERS_DEAD) {
        return handlePlayerDeadInput(input);
    } else if (gameState == GameStates.TARGETING) {
        return handleTargetingInput(input);
    } else if (gameState == GameStates.SHOW_INVENTORY || gameState == GameStates.DROP_INVENTORY) {
        return handleInventoryInput(input);
    } else if (gameState == GameStates.LEVEL_UP) {
        return handleLevelUpMenu(input);
    } else if (gameState == GameStates.CHARACTER_SCREEN) {
        return handleCharacterScreen(input);
    }

    return {};
}

function handlePlayerTurnInput(input) {
    // Movement
    if (input.isPressed(Key.LEFT) || input.isPressed(Key.NUMPAD4)) {
        input.removeKey(Key.LEFT);
        input.removeKey(Key.NUMPAD4);
        return {"move": [-1, 0]};
    } else if (input.isPressed(Key.RIGHT) || input.isPressed(Key.NUMPAD6)) {
        input.removeKey(Key.RIGHT);
        input.removeKey(Key.NUMPAD6);
        return {"move": [1, 0]};
    } else if (input.isPressed(Key.UP) || input.isPressed(Key.NUMPAD8)) {
        input.removeKey(Key.UP);
        input.removeKey(Key.NUMPAD8);
        return {"move": [0, -1]};
    } else if (input.isPressed(Key.DOWN) || input.isPressed(Key.NUMPAD2)) {
        input.removeKey(Key.DOWN);
        input.removeKey(Key.NUMPAD2);
        return {"move": [0, 1]};
    } else if (input.isPressed(Key.NUMPAD7)) {
        input.removeKey(Key.NUMPAD7);
        return {"move": [-1, -1]};
    } else if (input.isPressed(Key.NUMPAD9)) {
        input.removeKey(Key.NUMPAD9);
        return {"move": [1, -1]};
    } else if (input.isPressed(Key.NUMPAD1)) {
        input.removeKey(Key.NUMPAD1);
        return {"move": [-1, 1]};
    } else if (input.isPressed(Key.NUMPAD3)) {
        input.removeKey(Key.NUMPAD3);
        return {"move": [1, 1]};
    } else if (input.isPressed(Key.NUMPAD5)) {
        input.removeKey(Key.NUMPAD5);
        return {"wait": true};
    } else if (input.isPressed(Key.G)) {
        input.removeKey(Key.G);
        return {"pickup": true};
    } else if (input.isPressed(Key.I)) {
        input.removeKey(Key.I);
        return {"showInventory": true};
    } else if (input.isPressed(Key.D)) {
        input.removeKey(Key.D);
        return {"dropInventory": true};
    } else if (input.isPressed(Key.ENTER) || (input.isPressed(Key.SHIFT) && input.isPressed(Key.PERIOD))) {
        input.removeKey(Key.ENTER);
        input.removeKey(Key.PERIOD);
        return {"takeStairs": true};
    } else if (input.isPressed(Key.C)) {
        input.removeKey(Key.C);
        return {"showCharacterScreen": true};
    }

    // Toggle "fullscreen" scale
    if (input.isPressed(Key.ENTER) && input.isPressed(Key.ALT)) {
        input.removeKey(Key.ENTER);
        return {"fullscreen": true};
    }

    if (input.isPressed(Key.ESCAPE)) {
        input.removeKey(Key.ESCAPE);
        return {"escape": true};
    }

    return {};
}

function handleTargetingInput(input) {
    if (input.isPressed(Key.ESCAPE)) {
        input.removeKey(Key.ESCAPE);
        return {"escape": true};
    }

    return {};
}

function handlePlayerDeadInput(input) {
    if (input.isPressed(Key.I)) {
        input.removeKey(Key.I);
        return {"inventory": true};
    }

    // Toggle "fullscreen" scale
    if (input.isPressed(Key.ENTER) && input.isPressed(Key.ALT)) {
        input.removeKey(Key.ENTER);
        return {"fullscreen": true};
    }

    if (input.isPressed(Key.ESCAPE)) {
        input.removeKey(Key.ESCAPE);
        return {"escape": true};
    }

    return {};
}

function handleInventoryInput(input) {
    var keyPressed = null;
    for (var key = Key.A; key <= Key.Z; key ++) {
        if (input.isPressed(key)) {
            keyPressed = key;

            input.removeKey(key);
            break;
        }
    }
    if (keyPressed) {
        var index = key - Key.A;
        return {"inventoryIndex": index};
    }

    // Toggle "fullscreen" scale
    if (input.isPressed(Key.ENTER) && input.isPressed(Key.ALT)) {
        input.removeKey(Key.ENTER);
        return {"fullscreen": true};
    }

    if (input.isPressed(Key.ESCAPE)) {
        input.removeKey(Key.ESCAPE);
        return {"escape": true};
    }

    return {};
}

function handleMainMenu(input) {
    if (input.isPressed(Key.A)) {
        input.removeKey(Key.A);
        return {"newGame": true};
    } else if (input.isPressed(Key.B)) {
        input.removeKey(Key.B);
        return {"loadSavedGame": true};
    } else if (input.isPressed(Key.c) || input.isPressed(Key.ESCAPE)) {
        input.removeKey(Key.C);
        input.removeKey(Key.ESCAPE);
        return {"escape": true};
    }

    // Toggle "fullscreen" scale
    if (input.isPressed(Key.ENTER) && input.isPressed(Key.ALT)) {
        input.removeKey(Key.ENTER);
        return {"fullscreen": true};
    }

    return {};
}

function handleLevelUpMenu(input) {
    if (input.isPressed(Key.A)) {
        input.removeKey(Key.A);
        return {"levelUp": "hp"};
    } else if (input.isPressed(Key.B)) {
        input.removeKey(Key.B);
        return {"levelUp": "str"};
    } else if (input.isPressed(Key.C)) {
        input.removeKey(Key.C);
        return {"levelUp": "def"};
    }

    return {};
}

function handleCharacterScreen(input) {
    if (input.isPressed(Key.ESCAPE)) {
        input.removeKey(Key.ESCAPE);
        return {"escape": true};
    }

    return {};
}

function handleMouseInput(input, canvasState) {
    if (input.mouse.left) {
        var tile = input.getMouseTile(canvasState.scale);

        return {"leftClick": [tile.x, tile.y]};
    }
    if (input.mouse.right) {
        return {"rightClick": true};
    }

    return {};
}