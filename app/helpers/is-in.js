Encompass.IsInHelper = Ember.Helper.helper( function(args){
  let [list, val] = args;
  return _.contains(list, val);
});
