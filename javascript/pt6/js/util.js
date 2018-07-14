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
    }
}