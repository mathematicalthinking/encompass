Encompass.FormatDateHelper = Ember.Helper.helper(function (date, format) {
  // return moment(date[0]).format("MMM Do YYYY");
  return moment(date[0]).format("L");
});
