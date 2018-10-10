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
  accessibleUserCount: 24,

  accessibleSubmissionCount: 53,
  unaccessibleSubmission: {
    _id: "5bb814d19885323f6d894973"
  },
  accessibleSubmission: {
    _id: "53e1156db48b12793f00042d"
  },
  accessibleCommentCount: 4,
  accessibleComment: {
    _id: "53e12264b48b12793f000b84"
  },
  inaccessibleComment: {
    _id: "5bbb9d86c2aa0a1696840ceb"
  },
  validComment: {
    label: 'wonder',
    text: 'i wonder if thats the best strategy',
    selection: '53e11f20b48b12793f000b3a',
    submission: '53e1156db48b12793f000427',
    workspace: '53e1156db48b12793f000442',
    useForResponse: true,
    isTrashed: false,
    createdBy: '5b7321ee59a672806ec903d5',
  },
  modifiableComment: {
    _id: '5bbbba86a6a7ee1a9a5ebc75',
    label : 'wonder',
    text : 'I wonder what this means...',
    createdBy : '5b7321ee59a672806ec903d5',
    selection : '5bbbba75a6a7ee1a9a5ebc74',
    origin : null,
    parent : null,
    submission : '53e1156db48b12793f000414',
    workspace : '53e1156db48b12793f000442',
  },
  accessibleAnswerCount: 2,
  accessibleSelectionCount: 72,
  inaccessibleSelection: {
    _id: '5bbb9d57c2aa0a1696840ce9'
  },
  accessibleSelection: {
    _id: '53e38ac3b48b12793f0010d4'
  },
  accessibleAssignmentCount: 1,
  accessibleAssignment: {
    _id: '5b9146a83add43b868ae9809',
  },
  inaccessibleAssignment: {
    _id: '5b91743a3da5efca74705773'
  },
  accessibleFolderCount: 32,
  inaccessibleFolder: {
    _id: '5bb814d19885323f6d894975'
  },
  accessibleFolder: {
    _id: '53e11604b48b12793f0004ee'
  },
  validFolder: {
    name: 'test folder',
    createdBy: '5b1e7bf9a5d2157ef4c911a6',
    workspace: '53e1156db48b12793f000442'
  },
  modifiableFolder: {
    _id: '53e11604b48b12793f0004ee',
    name: 'Correct'
  }
};

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
  accessibleUserCount: 20,
  accessibleSubmissionCount: 18,
  unaccessibleSubmission: {
    _id: "53e1156db48b12793f000417"
  },
  accessibleSubmission: {
    _id: "53e36522729e9ef59ba7f4da"
  },
  accessibleCommentCount: 2,
  accessibleComment: {
    _id: "53e37a4ab48b12793f00104c"
  },
  inaccessibleComment: {
    _id: "53e12264b48b12793f000b84"
  },
  validComment: {
    label: 'feedback',
    text: 'i wonder if thats the best strategy',
    selection: '5bbb9d57c2aa0a1696840ce9',
    submission: '5bb814d19885323f6d894973',
    workspace: '5bb814d19885323f6d894974',
    useForResponse: true,
    isTrashed: false,
    createdBy: '5b9149552ecaf7c30dd4748e',
  },
  modifiableComment: {
    _id: "5bbb9d86c2aa0a1696840ceb",
    label: "feedback",
    selection : "5bbb9d57c2aa0a1696840ce9",
    submission : "5bb814d19885323f6d894973",
    workspace : "5bb814d19885323f6d894974",
    createdBy: "5b9149552ecaf7c30dd4748e",
    text: "I notice that your explanation is vague."
  },
  accessibleAnswerCount: 1,
  accessibleSelectionCount: 62,
  inaccessibleSelection: {
    _id: '53e12211b48b12793f000b7e'
  },
  accessibleSelection: {
    _id: '53e37f14b48b12793f001097'
  },
  accessibleAssignmentCount: 1,
  accessibleAssignment: {
    _id: '5b91743a3da5efca74705773',
  },
  inaccessibleAssignment: {
    _id: '5b9146a83add43b868ae9809'
  },
  accessibleFolderCount: 31,
  inaccessibleFolder: {
    _id: '53e11b0ab48b12793f000ab1'
  },
  accessibleFolder: {
    _id: '5bb814d19885323f6d894975'
  },
  validFolder: {
    name: 'test folder',
    createdBy: '5b1e7bf9a5d2157ef4c911a6',
    workspace: '5bb814d19885323f6d894974'
  },
  modifiableFolder: {
    _id: '5bb814d19885323f6d894975',
    name: 'Reasonable'
  }
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
  accessibleUserCount: 37,
  accessibleSubmissionCount: 54,
  accessibleSubmission: {
    _id: "5bb814d19885323f6d894973"
  },
  accessibleCommentCount: 5,
  accessibleComment: {
    _id: "53e12507b48b12793f000b91"
  },
  validComment: {
    label: 'notice',
    text: 'i wonder if thats the best strategy',
    selection: '53e37f3cb48b12793f00109a',
    submission: '53e36522729e9ef59ba7f4d7',
    workspace: '53e36522b48b12793f000d3b',
    useForResponse: true,
    isTrashed: false,
    createdBy: '5b245760ac75842be3189525',
  },
  modifiableComment: {
    _id: "5bbb9d86c2aa0a1696840ceb",
    label: "feedback",
    selection : "5bbb9d57c2aa0a1696840ce9",
    submission : "5bb814d19885323f6d894973",
    workspace : "5bb814d19885323f6d894974",
    createdBy: "5b9149552ecaf7c30dd4748e",
    text: "I notice that your explanation is vague."
  },

  accessibleAnswerCount: 3,
  accessibleSelectionCount: 73,
  accessibleSelection: {
    _id: '5bbb9d57c2aa0a1696840ce9'
  },
  accessibleAssignmentCount: 2,
  accessibleAssignment: {
    _id: '5b9146a83add43b868ae9809',
  },
  accessibleFolderCount: 36,
  accessibleFolder: {
    _id: '5bb814d19885323f6d894975'
  },
  validFolder: {
    name: 'test folder',
    createdBy: '5b1e7bf9a5d2157ef4c911a6',
    workspace: '5bb814d19885323f6d894974'
  },
  modifiableFolder: {
    _id: '5bb814d19885323f6d894975',
    name: 'Reasonable'
  }
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

  unaccessibleSubmission: {
    _id: "53e36522729e9ef59ba7f4df"
  },
  inaccessibleComment: {
    _id: "53e37a4ab48b12793f00104c"
  },
  validComment: {
    label: 'feedback',
    text: 'i wonder if thats the best strategy',
    selection: '5bbb9d57c2aa0a1696840ce9',
    submission: '5bb814d19885323f6d894973',
    workspace: '5bb814d19885323f6d894974',
    useForResponse: true,
    isTrashed: false,
    createdBy: '5b914a102ecaf7c30dd47492',
  },

  accessibleAnswerCount: 1,
  inaccessibleSelection: {
    _id: '5bbb9d57c2aa0a1696840ce9'
  },
  accessibleAssignmentCount: 1,
  accessibleAssignment: {
    _id: '5b91743a3da5efca74705773',
  },
  inaccessibleAssignment: {
    _id: '5b9146a83add43b868ae9809'
  },
  inaccessibleFolder: {
    _id: '53e36cdbb48b12793f000d43'
  },
  validFolder: {
    name: 'test folder',
    createdBy: '5b1e7bf9a5d2157ef4c911a6',
    workspace: '5bb814d19885323f6d894974'
  }
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
  unaccessibleSubmission: {
    _id: "53e36522729e9ef59ba7f4db"
  },
  inaccessibleComment: {
    _id: "53e37a4ab48b12793f00104c"
  },
  validComment: {
    label: 'feedback',
    text: 'i wonder if thats the best strategy',
    selection: '5bbb9d57c2aa0a1696840ce9',
    submission: '5bb814d19885323f6d894973',
    workspace: '5bb814d19885323f6d894974',
    useForResponse: true,
    isTrashed: false,
    createdBy: '5b99146e25b620610ceead75',
  },
  accessibleAnswerCount: 0,
  inaccessibleSelection: {
    _id: '5bbb9d57c2aa0a1696840ce9'
  },
  accessibleAssignmentCount: 1,
  accessibleAssignment: {
    _id: '5b91743a3da5efca74705773',
  },
  inaccessibleAssignment: {
    _id: '5b9146a83add43b868ae9809'
  },
  inaccessibleFolder: {
    _id: '53e36cdbb48b12793f000d43'
  },
  validFolder: {
    name: 'test folder',
    createdBy: '5b1e7bf9a5d2157ef4c911a6',
    workspace: '5bb814d19885323f6d894974'
  }

};
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

// const accessibleOrgCount = 3;
// 3;


module.exports.users = users;
module.exports.publicProblem = publicProblem;