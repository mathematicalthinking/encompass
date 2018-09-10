const pdAdminDrexel = {
  username: 'pdadmin',
  password: 'pdadmin',
  organization: '5b4a64a028e4b75919c28512',
  unaccessibleUser: {
    _id: '5b914a802ecaf7c30dd47493',
    username: 'teachertaylor',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'T'
  },
  accessibleUser: {
    _id: '5b913eaf3add43b868ae9806',
    username: 'sam3',
    accountType: 'S'
  },
  accessibleUserCount: 23
}

const teacherMT = {
  username: 'ssmith',
  password: 'ssmith',
  organization: '5b4e4d5f808c7eebc9f9e82c',
  unaccessibleUser: {
    _id: '5b913ebe3add43b868ae9807',
    username: 'jamie4',
    organization: '5b4a64a028e4b75919c28512',
    accountType: 'S'
  },
  accessibleUser: {
    _id: '5b914a802ecaf7c30dd47493',
    username: 'teachertaylor',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'T',
    createdBy: '5b245760ac75842be3189525'

  },
  accessibleUserCount: 16
};

module.exports.pdAdminDrexel = pdAdminDrexel;
module.exports.teacherMT = teacherMT;