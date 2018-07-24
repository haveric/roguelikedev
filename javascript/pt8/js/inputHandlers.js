function handleInput(input, gameState) {
    if (gameState == GameStates.PLAYERS_TURN) {
        return handlePlayerTurnInput(input);
    } else if (gameState == GameStates.PLAYERS_DEAD) {
        return handlePlayerDeadInput(input);
    } else if (gameState == GameStates.SHOW_INVENTORY) {
        return handleInventoryInput(input);
    }
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
    }

    if (input.isPressed(Key.G)) {
        input.removeKey(Key.G);
        return {"pickup": true};
    }

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