;(function() {
	var canvasState = new CanvasState("gameCanvas", 642, 500);
	var input = new Input();
	
	var SCREEN_WIDTH = 80;
	var SCREEN_HEIGHT = 50;
	
	var playerX = SCREEN_WIDTH / 2;
	var playerY = SCREEN_HEIGHT / 2;
	
	function main() {
		window.requestAnimationFrame(main);
		
		update();
		render();
	}
	
	function update() {
		handleInput();
	}
	
	function render() {
		canvasState.clear("#eee");
		
		drawCharacter("@", playerX, playerY, "#000");
	}
	
	function drawCharacter(character, x, y, color) {
		var xOffset = 2;
		var yOffset = 7;
		var xWidth = 8;
		var yHeight = 10;
		
		canvasState.setFillStyle(color);
		canvasState.setFont((10 * canvasState.scale) + "px monospace");
		canvasState.context.fillText(character, (x * xWidth + xOffset) * canvasState.scale, (y * yHeight + yOffset) * canvasState.scale);
	}
	
	function handleInput() {
		// Movement
		if (input.isPressed(Key.LEFT)) {
			playerX -= 1;
			input.removeKey(Key.LEFT);
		} else if (input.isPressed(Key.RIGHT)) {
			playerX += 1;
			input.removeKey(Key.RIGHT);
		} else if (input.isPressed(Key.UP)) {
			playerY -= 1;
			input.removeKey(Key.UP);
		} else if (input.isPressed(Key.DOWN)) {
			playerY += 1;
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