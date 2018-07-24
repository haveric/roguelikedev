function heal(args, kwargs) {
    var entity = args.player;
    var amount = kwargs.amount;

    var results = [];

    if (entity.fighter.hp == entity.fighter.maxHp) {
        results.push({"consumed": false, "message": new Message("You are already at full health", "#FFFF00")});
    } else {
        entity.fighter.heal(amount);
        results.push({"consumed": true, "message": new Message("Your wounds start to feel better!", "#00FF00")});
    }

    return results;
}