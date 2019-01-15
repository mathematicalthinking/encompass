Encompass.CollabPermissionsHelper = Ember.Helper.helper(function(val) {
  let text;
  val = val[0];
  switch (val) {
    case 0:
      text = 'Hidden';
      return text;
    case 1:
      text = 'View Only';
      return text;
    case 2:
      text = 'Create';
      return text;
    case 3:
      text = 'Add';
      return text;
    case 4:
      text = 'Delete';
      return text;
    case 'preAuth':
      text = 'Pre-Authorized';
      return text;
    case 'none':
      text = 'None';
      return text;
    case 'authReq':
      text = 'Authorization Required';
      return text;
    default:
      text = "N/A";
      return text;
  }
});
