"use strict";

function renderMenu(canvasState, header, options, width) {
    if (options.length > 26) {
        console.err("Cannot have a menu with more than 26 options.");
    }

    var headerLines = Util.getTextLines(canvasState, header, width);
    var numHeaderLines = headerLines.length;
    if (numHeaderLines > 0) {
        numHeaderLines += 1;
    }
    var height = (options.length + numHeaderLines) * 10;

    var padding = 3;

    var x = (canvasState.CANVAS_WIDTH / 2) - (width / 2);
    var y = (canvasState.CANVAS_HEIGHT / 2) - (height / 2);

    canvasState.setFillStyle("rgba(255,255,255,.7)");
    canvasState.fillRect(x - padding, y - padding, width + (padding * 2), height + (padding * 2));

    canvasState.setFillStyle("#000");
    canvasState.setFont(10);
    canvasState.setTextAlign("start", "alphabetic");

    var currentY = y + 8;
    for (var headerLine of headerLines) {
        canvasState.fillText(headerLine, x, currentY);
        currentY += 10;
    }

    if (numHeaderLines > 0) {
        currentY += 10; // Add a blank line.
    }

    var letterIndex = "a".charCodeAt();
    for (var option of options) {
        var text = "(" + String.fromCharCode(letterIndex) + ") " + option;
        canvasState.fillText(text, x, currentY);
        currentY += 10;
        letterIndex += 1;
    }
}

function renderInventoryMenu(canvasState, header, player, inventoryWidth) {
    var options = [];
    if (player.inventory.items.length == 0) {
        options.push("Inventory is empty");
    } else {
        for (var i = 0; i < player.inventory.items.length; i++) {
            var item = player.inventory.items[i];
            if (player.equipment.isEquippedSlot(item, EquipmentSlot.MAIN_HAND)) {
                options.push("{0} (on main hand)".format(item.name));
            } else if (player.equipment.isEquippedSlot(item, EquipmentSlot.OFF_HAND)) {
                options.push("{0} (on off hand)".format(item.name));
            } else if (player.equipment.isEquippedSlot(item, EquipmentSlot.RING)) {
                options.push("{0} (on finger)".format(item.name));
            } else {
                options.push(item.name);
            }
        }
    }

    renderMenu(canvasState, header, options, inventoryWidth);
}

function renderMainMenu(canvasState) {
    var bgImage = textureManager.get("menu-bg");
    canvasState.drawImage(bgImage, 0, 0, canvasState.CANVAS_WIDTH, canvasState.CANVAS_HEIGHT);

    canvasState.setFillStyle("#FFFF00");
    canvasState.setFont(10);
    canvasState.setTextAlign("center", "middle");
    canvasState.fillText("TOMBS OF THE ANCIENT KINGS", canvasState.CANVAS_WIDTH / 2, (canvasState.CANVAS_HEIGHT / 2) - 30);
    canvasState.fillText("By haveric", canvasState.CANVAS_WIDTH / 2, canvasState.CANVAS_HEIGHT - 20);

    var options = ["Play a new game", "Continue last game", "Quit"];
    renderMenu(canvasState, "", options, 150);
}

function renderLevelUpMenu(canvasState, player) {
    var options = ["Constitution (+20 HP, from {0})".format(player.getMaxHp()),
                   "Strength (+1 attack, from {0})".format(player.getPower()),
                   "Agility (+1 defense, from {0})".format(player.getDefense())];

    renderMenu(canvasState, "Level up! Choose a stat to raise: ", options, 400);
}

function renderCharacterScreen(canvasState, player) {
    var width = 150;
    var height = 80;

    var padding = 3;

    var x = (canvasState.CANVAS_WIDTH / 2) - (width / 2);
    var y = (canvasState.CANVAS_HEIGHT / 2) - (height / 2);

    canvasState.setFillStyle("rgba(255,255,255,.7)");
    canvasState.fillRect(x - padding, y - padding, width + (padding * 2), height + (padding * 2));

    canvasState.setFillStyle("#000");
    canvasState.setFont(10);
    canvasState.setTextAlign("start", "alphabetic");

    canvasState.fillText("Character Information", x, y+=10);
    canvasState.fillText("Level: {0}".format(player.level), x, y+=10);
    canvasState.fillText("Experience: {0}".format(player.xp), x, y+=10);
    canvasState.fillText("Experience to level: {0}".format(player.getXpToNextLevel()), x, y+=10);
    canvasState.fillText("Max HP: {0}".format(player.getMaxHp()), x, y+=20);
    canvasState.fillText("Attack: {0}".format(player.getPower()), x, y+=10);
    canvasState.fillText("Defense: {0}".format(player.getDefense()), x, y+=10);
}

function renderMessageBox(canvasState, header, width) {
    var options = [];
    renderMenu(canvasState, header, options, width);
}