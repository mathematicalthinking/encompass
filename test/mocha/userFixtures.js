const pdAdminDrexel = {
  testDescriptionTitle: 'PD Admin',
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
    accountType: 'S',
    createdBy: '5b245841ac75842be3189526',
    creatorUsername: 'morty'
  },

  modifiableUser: {
    _id: '5b913eaf3add43b868ae9806',
    username: 'sam3',
    accountType: 'S'
  },
  accessibleUserCount: 23
}

const teacherMT = {
  testDescriptionTitle: 'Teacher',
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
    createdBy: '5b245760ac75842be3189525',
    creatorUsername: 'rick'

  },

  modifiableUser: {
    _id: '5b914a102ecaf7c30dd47492',
    username: 'tracyc',
    accountType: 'S'
  },
  accessibleUserCount: 17
};

const admin = {
  testDescriptionTitle: 'Admin',
  username: 'rick',
  password: 'sanchez',
  organization: '5b4a64a028e4b75919c28512',
  accountType: 'A',
  accessibleUser: {
    _id: '5b914a802ecaf7c30dd47493',
    username: 'teachertaylor',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'T',
    createdBy: '5b245760ac75842be3189525',
    creatorUsername: 'rick'
  },
  modifiableUser: {
    _id: '5b914a102ecaf7c30dd47492',
    username: 'tracyc',
    accountType: 'S'
  },
  accessibleUserCount: 35

};

const studentMT = {
  testDescriptionTitle: 'Student',
  username: 'tracyc',
  password: 'tracyc',
  organization: '5b4e4d5f808c7eebc9f9e82c',
  accountType: 'S',
  accessibleUser: {
    _id: '5b914a802ecaf7c30dd47493',
    username: 'teachertaylor',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'T',
    createdBy: '5b245760ac75842be3189525',
    creatorUsername: 'rick'
  },
  unaccessibleUser: {
    _id: '5b913ebe3add43b868ae9807',
    username: 'jamie4',
    organization: '5b4a64a028e4b75919c28512',
    accountType: 'S'
  },
  accessibleUserCount: 6,
  modifiableUser: {
    _id: '5b914a102ecaf7c30dd47492',
    username: 'tracyc',
    accountType: 'S'
  },
};

const teacherActingStudent = {
  testDescriptionTitle: 'Teacher acting as Student',
  username: 'actingstudent',
  password: 'allison',
  organization: '5b4e4d5f808c7eebc9f9e82c',
  accountType: 'T',
  actingRole: 'student',
  accessibleUser: {
    _id: '5b914a102ecaf7c30dd47492',
    username: 'tracyc',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'S',
    createdBy: '5b9149552ecaf7c30dd4748e',
    creatorUsername: 'ssmith'
  },
  unaccessibleUser: {
    _id: '5b913ebe3add43b868ae9807',
    username: 'jamie4',
    organization: '5b4a64a028e4b75919c28512',
    accountType: 'S'
  },
  accessibleUserCount: 6,
  modifiableUser: {
    _id: '5b4e4d5f808c7eebc9f9e82c',
    username: 'actingStudent',
    accountType: 'T'
  },
}

const users = {
  admin,
  pdAdminDrexel,
  teacherMT,
  studentMT,
  teacherActingStudent
};


module.exports.users = users;