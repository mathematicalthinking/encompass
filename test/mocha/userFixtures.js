const pdAdminDrexel = {
  username: 'pdadmin',
  password: 'pdadmin',
  organization: '5b4a64a028e4b75919c28512',
  accountType: 'P',
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

  modifiableUser: {
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
  accountType: 'T',
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

  modifiableUser: {
    _id: '5b914a102ecaf7c30dd47492',
    username: 'tracyc',
    accountType: 'S'
  },
  accessibleUserCount: 16
};

const admin = {
  username: 'rick',
  password: 'sanchez',
  organization: '5b4a64a028e4b75919c28512',
  accountType: 'A',
  accessibleUser: {
    _id: '5b914a802ecaf7c30dd47493',
    username: 'teachertaylor',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'T',
    createdBy: '5b245760ac75842be3189525'
  },
  modifiableUser: {
    _id: '5b914a102ecaf7c30dd47492',
    username: 'tracyc',
    accountType: 'S'
  },
  accessibleUserCount: 33

};

const studentMT = {
  username: 'tracyc',
  password: 'tracyc',
  organization: '5b4e4d5f808c7eebc9f9e82c',
  accountType: 'S',
  accessibleUser: {
    _id: '5b914a802ecaf7c30dd47493',
    username: 'teachertaylor',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'T',
    createdBy: '5b245760ac75842be3189525'
  },
  unaccessibleUser: {
    _id: '5b913ebe3add43b868ae9807',
    username: 'jamie4',
    organization: '5b4a64a028e4b75919c28512',
    accountType: 'S'
  },
  accessibleUserCount: 5,
  modifiableUser: {
    _id: '5b914a102ecaf7c30dd47492',
    username: 'tracyc',
    accountType: 'S'
  },
};

const users = {
  admin,
  pdAdminDrexel,
  teacherMT,
  studentMT
}

module.exports.pdAdminDrexel = pdAdminDrexel;
module.exports.teacherMT = teacherMT;
module.exports.users = users;