Encompass.PermissionsHelper = Ember.Helper.helper(function (val) {
  let text;
  switch (val) {
    case (val === 1):
      text = 'View Only';
      break;
    case (val === 2):
      text = 'View Only';
      break;
    case (val === 3):
      text = 'View Only';
      break;
    case (val === 4):
      text = 'View Only';
      break;
    case (val === 5):
      text = 'View Only';
      break;
    default:
      text = "N/A";
  }

});
