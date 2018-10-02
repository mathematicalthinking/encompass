const pdAdminDrexel = {
  _id: '5b7321ee59a672806ec903d5',
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
  accessibleUserCount: 24
}

const teacherMT = {
  _id: '5b9149552ecaf7c30dd4748e',
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
  accessibleUserCount: 20
};

const admin = {
  _id: '5b245760ac75842be3189525',
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
  accessibleUserCount: 37

};

const studentMT = {
  _id: '5b914a102ecaf7c30dd47492',
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
  _id: '5b99146e25b620610ceead75',
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

const publicProblem = {
  _id: "5ba7c3cb1359dc2f6699f2b3",
  createdBy: "5ba7bedd2b7ba22c38a554fc",
  creatorUsername: "tpool",
};

const accessibleOrgCount = 3;


module.exports.users = users;
module.exports.publicProblem = publicProblem;