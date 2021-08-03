import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  let [status] = args;
  let statusMap = {
    'approved': 'Approved',
    'pendingApproval': 'Pending Approval',
    'needsRevisions': 'Needs Revisions',
    'superceded': 'Superceded',
    'draft': 'Draft',
  };
  return statusMap[status];
});