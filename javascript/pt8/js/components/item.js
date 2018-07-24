var Item = function(useFunction, kwargs) {
    this.owner = null;
    this.useFunction = useFunction || null;
    this.functionKwargs = kwargs;
}