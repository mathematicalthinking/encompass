export default function (status) {
  let statusMap = {
    approved: 'Approved',
    pendingApproval: 'Pending Approval',
    needsRevisions: 'Needs Revisions',
    superceded: 'Superceded',
    draft: 'Draft',
  };
  return statusMap[status] || 'Unknown';
}
