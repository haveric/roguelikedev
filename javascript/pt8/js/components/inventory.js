var Inventory = function(capacity) {
    this.owner = null;
    this.capacity = capacity;
    this.items = [];
}

Inventory.prototype.addItem = function(item) {
    var results = [];

    if (this.items.length >= this.capacity) {
        results.push({
            'itemAdded': null,
            'message': new Message("You cannot carry any more, your inventory is full", "#FFFF00")
        });
    } else {
        results.push({
            'itemAdded': item,
            'message': new Message("You pick up the {0}!".format(item.name), "#FFFF00")
        });

        this.items.push(item);
    }

    return results;
}

Inventory.prototype.useItem = function(itemEntity) {
    var results = [];

    var itemComponent = itemEntity.item;

    if (itemComponent.useFunction) {
        var kwargs = itemComponent.functionKwargs;
        var itemUseResults = itemComponent.useFunction({"player": this.owner}, kwargs);

        for (var itemUseResult of itemUseResults) {
            if (itemUseResult.consumed) {
                this.removeItem(itemEntity);
            }
        }

        results = results.concat(itemUseResults);
    } else {
        results.push({"message": new Message("The {0} cannot be used".format(itemEntity.name), "#FFFF00")});
    }

    return results;
}

Inventory.prototype.removeItem = function(item) {
    var index = this.items.indexOf(item);
    if (index > -1) {
        this.items.splice(index, 1)
    }
}