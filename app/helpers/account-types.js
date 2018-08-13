Encompass.AccountTypesHelper = Ember.Helper.helper(function (accountType) {
  if (accountType === "A") {
    return 'Admin';
  } else if (accountType === "T") {
    return 'Teacher';
  } else if (accountType === "S") {
    return 'Student';
  } else if (accountType === 'P') {
    return 'Pd Admin';
  } else {
    return 'Undefined';
  }

});
