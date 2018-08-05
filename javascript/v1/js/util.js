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
    },

    getTileDistance: function(x1, y1, x2, y2) {
        return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    },

    getDiagonalDistance: function(x1, y1, x2, y2) {
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);

        return Math.sqrt(dx * dx + dy * dy);
    }
}

var Random = {
    getInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    choiceFromDict: function(choiceDict) {
        var choices = Object.keys(choiceDict);
        var chances = Object.values(choiceDict);
        var index = Random.choiceIndex(chances);

        return choices[index];
    },

    choiceIndex: function(chances) {
        var sum = 0;
        for (var chance of chances) {
            sum += chance;
        }

        var randomChance = Random.getInt(1, sum);
        var runningSum = 0;
        var choice = 0;

        for (var w of chances) {
            runningSum += w;

            if (randomChance <= runningSum) {
                break;
            }
            choice += 1;
        }

        return choice;
    },

    fromDungeonLevel: function(table, dungeonLevel) {
        var tableLength = table.length;
        for (var i = tableLength - 1; i >= 0; i--) {
            var item = table[i];
            var value = item[0];
            var level = item[1];

            if (dungeonLevel >= level) {
                return value;
            }
        }

        return 0;
    }
}