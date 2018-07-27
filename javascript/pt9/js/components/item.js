var Item = function(useFunction, targeting, targetingMessage, args) {
    this.owner = null;
    this.useFunction = useFunction || null;
    this.targeting = targeting || false;
    this.targetingMessage = targetingMessage || null;
    this.functionArgs = args;
}