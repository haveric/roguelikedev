"use strict";

var Message = function(text, color="#ffffff") {
    this.text = text;
    this.color = color;
}

var MessageLog = function() {
    this.messages = [];
    this.x = 220;
    this.y = 440;
    this.width = 800 - this.x;
    this.maxLines = 6;
    this.updateLines = false;
}

MessageLog.prototype.addMessage = function(message) {
    this.messages.push(message);
    this.updateLines = true;
}

MessageLog.prototype.render = function(canvasState) {
    if (this.updateLines) {
        var updatedMessages = [];
        for (var message of this.messages) {
            var messageLines = Util.getTextLines(canvasState, message.text, this.width);

            for (var line of messageLines) {
                if (updatedMessages.length == this.maxLines) {
                    updatedMessages.splice(0, 1);
                }

                updatedMessages.push(new Message(line, message.color));
            }
        }
        this.updateLines = false;
        this.messages = updatedMessages;
    }

    var y = this.y;
    for (var message of this.messages) {
        drawText(canvasState, message.text, this.x, y, message.color);
        y += 10;
    }
}