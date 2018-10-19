Encompass.PublicPrivateHelper = Ember.Helper.helper(function (setting) {
  if (setting[0] === "O" || setting[0] === "E") {
    // return 'public';
    return '<i class="fas fa-globe-americas"></i>';
  } else {
    // return 'private';
    return '<i class="fas fa-lock"></i>';
  }

});
