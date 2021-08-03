// use to indicate unread responses or responses that need approval or revisions for now
import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  let [response, currentUser] = args;

  if (!response || !currentUser) {
    return;
  }

  let recipientRef = response.belongsTo('recipient');
  let creatorRef = response.belongsTo('createdBy');

  let status = response.get('status');

  let recipientId;
  let creatorId;

  if (recipientRef) {
    recipientId = recipientRef.id();
  }

  if (creatorRef) {
    creatorId = creatorRef.id();
  }

  if (!response.get('wasReadByRecipient') && currentUser.get('id') === recipientId) {
    return true;
  }

  if (status === 'pendingApproval') {
    if (creatorId !== currentUser.get('id')) {
      return true;
    }
  }

  if (status === 'needsRevisions') {
    return creatorId === currentUser.get('id');
  }

});
