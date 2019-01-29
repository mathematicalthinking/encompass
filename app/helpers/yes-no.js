Encompass.YesNoHelper = Ember.Helper.helper(function(args) {
  let [ val ] = args;

  if (val === true) {
    return 'Yes';
  }
  return 'No';
});