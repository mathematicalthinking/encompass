Encompass.PublicPrivateHelper = Ember.Helper.helper(function (setting) {
  if (setting[0] === "O" || setting[0] === "E" || setting[0]==="public") {
    return '<i class="fas fa-globe-americas"></i>';
  } else if (setting[0] === "M" || setting[0] === "private") {
    return '<i class="fas fa-lock"></i>';
  } else {
    return '<i class="fa fa-question"></i>';
  }

});
