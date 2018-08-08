// is-equal helper is necessary to determine which option is currently selected.
// app/helpers/is-equal.js

Encompass.IsEqualHelper = Ember.Helper.helper( function(args){
  let [leftSide, rightSide] = args;
  return leftSide === rightSide;
});
