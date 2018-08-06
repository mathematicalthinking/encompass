Encompass.FormatDateHelper = Ember.Helper.helper(function (date, format) {
  console.log('date is currently', date[0]);
  // return moment(date[0]).format("MMM Do YYYY");
  return moment(date[0]).format("L");
});
