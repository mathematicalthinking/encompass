Encompass.CanTrashWsHelper = Ember.Helper.helper( function(args) {
  let [ user, ws ] = args;
  console.log(user, ws);
  const isAdmin = user.get('accountType') === 'A';
  const isOwner = ws.get('owner.id') === user.id;
  return isAdmin || isOwner;
});
