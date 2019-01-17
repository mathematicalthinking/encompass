Encompass.ResponseStatusHelper = Ember.Helper.helper( function(args){
  let [ status ] = args;
  let statusMap = {
    'approved': 'APPROVED',
    'pendingApproval': 'PENDING APPROVAL',
    'needsRevisions': 'NEEDS REVISIONS',
    'superceded': 'SUPERCEDED',
  };
  return statusMap[status];
});