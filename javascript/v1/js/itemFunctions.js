"use strict";

function heal(args) {
    var caster = args.caster;
    var amount = args.amount;

    var results = [];

    if (caster.hp == caster.getMaxHp()) {
        results.push({"consumed": false, "message": new Message("You are already at full health", "#FFFF00")});
    } else {
        caster.heal(amount);
        results.push({"consumed": true, "message": new Message("Your wounds start to feel better!", "#00FF00")});
    }

    return results;
}

function castLightning(args) {
    var caster = args.caster;
    var entities = args.entities;
    var fovMap = args.fovMap;
    var damage = args.damage;
    var maxRange = args.maxRange;

    var results = [];

    var target = null;
    var closestDistance = maxRange + 1;

    for (var entity of entities.entities) {
        if (entity instanceof Fighter && entity.hp > 0 && entity != caster && fovMap.isPointInFov(entity.x, entity.y)) {
            distance = caster.distanceTo(entity);

            if (distance < closestDistance) {
                target = entity;
                closestDistance = distance;
            }
        }
    }

    if (target) {
        results.push({"consumed": true, "target": target, "message": new Message("A lightning bolt strikes the {0} with a loud thunder! The damage is {1}".format(target.name, damage))});
        results = results.concat(target.takeDamage(damage));
    } else {
        results.push({"consumed": false, "target": null, "message": new Message("No enemy is close enough to strike.", "#FF0000")});
    }

    return results;
}

function castFireball(args) {
    var entities = args.entities;
    var fovMap = args.fovMap;
    var damage = args.damage;
    var radius = args.radius;
    var targetX = args.targetX;
    var targetY = args.targetY;

    var results = [];

    if (!fovMap.isPointInFov(targetX, targetY)) {
        results.push({"consumed": false, "message": new Message("You cannot target a tile outside your field of view.", "#FFFF00")});
        return results;
    }

    results.push({"consumed": true, "message": new Message("The fireball explodes, burning everything within {0} tiles!".format(radius), "#FF7F00")});

    for (var entity of entities.entities) {
        if (entity instanceof Fighter && entity.hp > 0 && entity.distanceToPoint(targetX, targetY) <= radius) {
            results.push({"message": new Message("The {0} gets burned for {1} hit points.".format(entity.name, damage))});
            results = results.concat(entity.takeDamage(damage));
        }
    }

    return results;
}

function castConfuse(args) {
    var entities = args.entities;
    var fovMap = args.fovMap;
    var targetX = args.targetX;
    var targetY = args.targetY;

    var results = [];

    if (!fovMap.isPointInFov(targetX, targetY)) {
        results.push({"consumed": false, "message": new Message("You cannot target a tile outside your field of view.", "#FFFF00")});
        return results;
    }

    var entityFound = false;
    for (var entity of entities.entities) {
        if (entity.ai && entity.x == targetX && entity.y == targetY) {
            var confusedAI = new ConfusedMonster(entity.ai, 10);

            entity.ai = confusedAI;

            results.push({"consumed": true, "message": new Message("The eyes of the {0} look vacant, as he starts to stumble around!".format(entity.name), "#73FF73")});

            entityFound = true;
            break;
        }
    }

    if (!entityFound) {
        results.push({"consumed": false, "message": new Message("There is no targetable enemy at that location.", "#FFFF00")});
    }

    return results;
}
