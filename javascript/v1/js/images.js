"use strict";

var TextureManager = function() {
    this.textures = [];
    //this.preloaded = false;
}

TextureManager.prototype.add = function(name, src) {
    var self = this;
    var image = new Image();

    image.onload = function() {
        self.textures.push(new Texture(name, image));
    }
    image.src = src;
}

TextureManager.prototype.get = function(name) {
    var foundTexture = null;

    var length = this.textures.length;
    for (var i = 0; i < length; i++) {
        var texture = this.textures[i];
        if (texture.name == name) {
            foundTexture = texture.image;
            break;
        }
    }
/*
    if (!foundTexture) {
        console.error("Texture not found: " + name);
    }
*/
    return foundTexture;
}

var Texture = function (name, image) {
    this.name = name;
    this.image = image;
}

var textureManager = new TextureManager();
textureManager.add("menu-bg", "img/menu_background.png");