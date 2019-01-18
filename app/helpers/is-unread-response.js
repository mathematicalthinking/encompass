
Encompass.IsUnreadResponseHelper = Ember.Helper.helper( function(args){
  let [response, currentUser] = args;
  let recipientRef = response.belongsTo('recipient');
  let recipientId;

  if (!response || !currentUser) {
    return;
  }

  if (recipientRef) {
    recipientId = recipientRef.id();
  }

  return !response.get('wasReadByRecipient') && currentUser.get('id') === recipientId;

});
