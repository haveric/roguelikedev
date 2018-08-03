var Inventory = function(capacity) {
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

Inventory.prototype.useItem = function(owner, item, args) {
    var results = [];

    if (item.useFunction) {
        Object.assign(args, {"caster": owner});

        if (item.targeting && !(args.targetX || args.targetY)) {
            results.push({"targeting": item});
        } else {
            Object.assign(args, item.functionArgs);

            var itemUseResults = item.callUseFunction(args);

            for (var itemUseResult of itemUseResults) {
                if (itemUseResult.consumed) {
                    this.removeItem(item);
                }
            }

            results = results.concat(itemUseResults);
        }
    } else {
        results.push({"message": new Message("The {0} cannot be used".format(item.name), "#FFFF00")});
    }

    return results;
}

Inventory.prototype.dropItem = function(owner, item) {
    var results = [];

    item.x = owner.x;
    item.y = owner.y;

    this.removeItem(item);
    results.push({"itemDropped": item, "message": new Message("You dropped the {0}".format(item.name), "#FFFF00")});

    return results;
}

Inventory.prototype.removeItem = function(item) {
    var index = this.items.indexOf(item);
    if (index > -1) {
        this.items.splice(index, 1)
    }
}