Encompass.CalculateTableHeightHelper = Ember.Helper.helper(function (args) {
  let [amount] = args;
  return amount * 31 + "px";
});
