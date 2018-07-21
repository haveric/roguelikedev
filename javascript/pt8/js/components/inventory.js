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