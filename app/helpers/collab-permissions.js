const PERMISSIONS_MAP = {
  0: 'Hidden',
  1: 'View Only',
  2: 'Create',
  3: 'Add',
  4: 'Delete',
  preAuth: 'Pre-Approved',
  none: 'None',
  authReq: 'Approval Required',
  approver: 'Approver',
  indirectMentor: 'Mentor',
  directMentor: 'Mentor with Direct Send',
  editor: 'Editor',
  viewOnly: 'View Only',
  custom: 'Custom',
};

export default function (val) {
  return PERMISSIONS_MAP[val] || 'N/A';
}
