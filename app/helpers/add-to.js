Encompass.AddToHelper = Ember.Helper.helper( function(args){
  let [base, numberToAdd] = args;
  return base + numberToAdd;
});