Encompass.PublicPrivateHelper = Ember.Helper.helper(function (setting) {
  if (setting[0] === "O" || setting[0] === "E") {
    return '<i class="fas fa-globe-americas"></i>';
  } else {
    return '<i class="fas fa-lock"></i>';
  }

});
