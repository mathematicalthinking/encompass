Encompass.FormatDateHelper = Ember.Helper.helper(function (args) {
  // args is array of arguments passed in from template
  let [date, format, doUseRelativeTime] = args;

  if (doUseRelativeTime) {
    return moment(date).fromNow();
  }
  return moment(date).format(format);
});
