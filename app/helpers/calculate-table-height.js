// this function is called in dashboard components to calculate the table height if smaller than max (~for rows, 124px)
Encompass.CalculateTableHeightHelper = Ember.Helper.helper(function (args) {
  let [amount] = args;
  return amount * 31 + "px";
});
