import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  let [user, ws] = args;

  if (!user || !ws) {
    return false;
  }
  const isAdmin = user.get('accountType') === 'A';
  const isOwner = ws.get('owner.id') === user.id;
  return isAdmin || isOwner;
});
