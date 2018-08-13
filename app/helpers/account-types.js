Encompass.AccountTypesHelper = Ember.Helper.helper(function (accountType) {
  if (accountType[0] === "A") {
    return 'Admin';
  } else if (accountType[0] === "T") {
    return 'Teacher';
  } else if (accountType[0] === "S") {
    return 'Student';
  } else if (accountType[0] === 'P') {
    return 'Pd Admin';
  } else {
    return 'Undefined';
  }

});
