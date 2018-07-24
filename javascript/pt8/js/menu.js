function renderMenu(canvasState, header, options, width) {
    if (options.length > 26) {
        console.err("Cannot have a menu with more than 26 options.");
    }

    var headerLines = Util.getTextLines(canvasState, header, width);
    var height = (options.length + headerLines.length) * 10;

    var x = (canvasState.CANVAS_WIDTH / 2) - (width / 2);
    var y = (canvasState.CANVAS_HEIGHT / 2) - (height / 2);

    canvasState.setFillStyle("rgba(255,255,255,.7)");
    canvasState.context.fillRect(x * canvasState.scale, y * canvasState.scale, width * canvasState.scale, height * canvasState.scale);

    canvasState.setFillStyle("#000");
    canvasState.setFont(10 * canvasState.scale + "px arial");
    canvasState.context.textAlign = "start";
    canvasState.context.textBaseline = "alphabetic";

    var currentY = y + 8;
    for (var headerLine of headerLines) {
        canvasState.context.fillText(headerLine, x * canvasState.scale, currentY * canvasState.scale);
        currentY += 10;
    }

    var letterIndex = "a".charCodeAt();
    for (var option of options) {
        var text = "(" + String.fromCharCode(letterIndex) + ") " + option;
        canvasState.context.fillText(text, x * canvasState.scale, currentY * canvasState.scale);
        currentY += 10;
        letterIndex += 1;
    }
}

function renderInventoryMenu(canvasState, header, inventory, inventoryWidth) {
    var options = [];
    if (inventory.items.length == 0) {
        options.push("Inventory is empty");
    } else {
        for (var i = 0; i < inventory.items.length; i++) {
            options.push(inventory.items[i].name);
        }
    }

    renderMenu(canvasState, header, options, inventoryWidth);
}
