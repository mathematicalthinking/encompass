Encompass.FmtDateHelper = Ember.Helper.helper( function(date, format) {
  return moment(date).format(format);
});
