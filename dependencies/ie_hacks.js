window.log = function() {
  log.history=log.history||[];
  log.history.push(arguments);
  
  if(this.console)
  {
    console.log(Array.prototype.slice.call(arguments));
  }
};
