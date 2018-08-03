"use strict";

String.prototype.format = String.prototype.format ||
function () {
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

var Util = {
    create2dArray: function(rows) {
        var array = [];

        for (var i = 0; i < rows; i++) {
            array[i] = [];
        }

        return array;
    },

    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    shuffleArray: function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    },

    getTextLines: function(canvasState, text, maxWidth) {
        var lines = [];

        if (text === "") {
            return lines;
        }

        maxWidth = maxWidth * canvasState.scale;
        var words = text.split(" ");
        var currentLine = words[0];

        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = canvasState.context.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}