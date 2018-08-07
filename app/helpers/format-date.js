Encompass.FormatDateHelper = Ember.Helper.helper(function (args) {
  // args is array of arguments passed in from template
  let [date, format] = args;
  return moment(date).format(format);
});
