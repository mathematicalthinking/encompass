//http://ryanmorr.com/understanding-scope-and-context-in-javascript/
//this is used in the workspace listings and apparently phantomjs doesn't have it
if(!('bind' in Function.prototype)){
    Function.prototype.bind = function(){
        var fn = this, context = arguments[0], args = Array.prototype.slice.call(arguments, 1);
        return function(){
            return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        }
    }
}
