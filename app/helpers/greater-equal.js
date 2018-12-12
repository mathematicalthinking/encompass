Encompass.GreaterEqualHelper = Ember.Helper.helper(function (args) {
  let [leftSide, rightSide] = args;
  return leftSide >= rightSide;
});
