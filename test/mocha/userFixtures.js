const admin = {
  details: {
    _id: '5b245760ac75842be3189525',
    testDescriptionTitle: 'Admin',
    username: 'rick',
    name: 'Rick Sanchez',
    password: 'sanchez',
    organization: '5b4a64a028e4b75919c28512',
    accountType: 'A',
  },
  users: {
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
  },
  submissions: {
    accessibleSubmissionCount: 56,
    accessibleSubmission: {
      _id: "5bb814d19885323f6d894973"
    },
  },
  comments: {
    accessibleCommentCount: 9,
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
      selection: "5bbb9d57c2aa0a1696840ce9",
      submission: "5bb814d19885323f6d894973",
      workspace: "5bb814d19885323f6d894974",
      createdBy: "5b4e4b48808c7eebc9f9e827",
      text: "I notice that your explanation is vague."
    },
  },
  answers: {
    accessibleAnswerCount: 4,
  },
  selections: {
    accessibleSelectionCount: 77,
    accessibleSelection: {
      _id: '5bbb9d57c2aa0a1696840ce9'
    },
  },
  assignments: {
    accessibleAssignmentCount: 2,
    accessibleAssignment: {
      _id: '5b9146a83add43b868ae9809',
    },
  },
  folders: {
    accessibleFolderCount: 45,
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
    },
  },
  sections: {
    accessibleSectionCount: 3,
    accessibleSection: {
      _id: '5b9149a32ecaf7c30dd4748f',
    },
    validSection: {
      name: 'test section',
      createdBy: '5b245760ac75842be3189525',
      assignments: [],
      students: [],
      teachers: [],
    },
    modifiableSection: {
      _id: '5b9149a32ecaf7c30dd4748f',
      name: `Summer's Algebra 2 1st Period`
    },
  },
  problems: {
    accessibleProblemCount: 20,
    accessibleProblem: {
      _id: '5b4e2e56be1e18425515308c',
    },
    validProblem: {
      title: 'test math problem',
      text: 'This is a problem',
      categories: [],
      createdBy: '5b245760ac75842be3189525',
    },
    invalidProblem: {
      title: '',
      puzzleId: '',
      text: '',
      categories: []
    },
    modifiableProblem: {
      _id: '5b4e2e6cbe1e18425515308d'
    }

  },
  folderSets: {
    accessibleFolderSetCount: 3,
    accessibleFolderSet: {
      _id: '5bec409176124a776f2ff00e'
    },
    validFolderSet: {
      name: 'test Folder Set',
      privacySetting: 'M',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
    },
    modifiableFolderSet: {
      _id: '5c1ba70fcdc05df4b5edc60c',
      name: 'Rick Public Set'
    },
  }
};
const pdAdminDrexel = {
  details: {
    _id: '5b7321ee59a672806ec903d5',
    testDescriptionTitle: 'PD Admin',
    username: 'pdadmin',
    name: 'PD Admin',
    password: 'pdadmin',
    organization: '5b4a64a028e4b75919c28512',
    accountType: 'P',
  },
  users: {
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
    accessibleUserCount: 25,
  },
  submissions: {
    accessibleSubmissionCount: 53,
    unaccessibleSubmission: {
      _id: "5bb814d19885323f6d894973"
    },
    accessibleSubmission: {
      _id: "53e1156db48b12793f00042d"
    },
  },
  comments: {
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
      label: 'wonder',
      text: 'I wonder what this means...',
      createdBy: '5b7321ee59a672806ec903d5',
      selection: '5bbbba75a6a7ee1a9a5ebc74',
      origin: null,
      parent: null,
      submission: '53e1156db48b12793f000414',
      workspace: '53e1156db48b12793f000442',
    },
  },
  answers: {
    accessibleAnswerCount: 2,
  },
  selections: {
    accessibleSelectionCount: 72,
    inaccessibleSelection: {
      _id: '5bbb9d57c2aa0a1696840ce9'
    },
    accessibleSelection: {
      _id: '53e38ac3b48b12793f0010d4'
    },
  },
  assignments: {
    accessibleAssignmentCount: 1,
    accessibleAssignment: {
      _id: '5b9146a83add43b868ae9809',
    },
    inaccessibleAssignment: {
      _id: '5b91743a3da5efca74705773'
    },
  },
  folders: {
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
    },
  },
  sections: {
    accessibleSectionCount: 2,
    inaccessibleSection: {
      _id: '5b9149a32ecaf7c30dd4748f'
    },
    accessibleSection: {
      _id: '5b913e723add43b868ae9804'
    },
    validSection: {
      name: 'A test section',
      createdBy: '5b7321ee59a672806ec903d5',
      assignments: [],
      students: [],
      teachers: [],
    },
    modifiableSection: {
      _id: '5b913e723add43b868ae9804',
      name: `Morty's Math 101`
    },
  },
  problems: {
    accessibleProblemCount: 18,
    accessibleProblem: {
      _id: '5b1e7a0ba5d2157ef4c91028',
    },
    inaccessibleProblem: {
      _id: '5b9173e23da5efca74705772'
    },
    validProblem: {
      title: 'test math problem',
      text: 'This is a problem',
      categories: [],
      createdBy: '5b7321ee59a672806ec903d5',
    },
    invalidProblem: {
      title: '',
      puzzleId: '',
      text: '',
      categories: []
    },
    modifiableProblem: {
      _id: ''
    }
  },
  folderSets: {
    accessibleFolderSetCount: 2,
    accessibleFolderSet: {
      _id: '5be5c5b1528e311460c0dd9e'
    },
    validFolderSet: {
      name: 'test Folder Set',
      privacySetting: 'M',
      createdBy: '5b7321ee59a672806ec903d5',
    },
    modifiableFolderSet: {
      _id: '5be5c5b1528e311460c0dd9e',
      name: 'Drexel Set Renamed'
    },
    inaccessibleFolderSet: {
      _id: '5bec409176124a776f2ff00e'
    }
  }
};

const teacherMT = {
  details: {
    _id: '5b4e4b48808c7eebc9f9e827',
    testDescriptionTitle: 'Teacher',
    username: 'ssmith',
    password: 'ssmith',
    name: 'Summer Smith',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'T',
  },
  users: {
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
    accessibleUserCount: 19,
  },
  submissions: {
    accessibleSubmissionCount: 20,
    unaccessibleSubmission: {
      _id: "53e1156db48b12793f000417"
    },
    accessibleSubmission: {
      _id: "53e36522729e9ef59ba7f4da"
    },
  },
  comments: {
    accessibleCommentCount: 6,
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
      createdBy: '5b4e4b48808c7eebc9f9e827',
    },
    modifiableComment: {
      _id: "5bbb9d86c2aa0a1696840ceb",
      label: "feedback",
      selection: "5bbb9d57c2aa0a1696840ce9",
      submission: "5bb814d19885323f6d894973",
      workspace: "5bb814d19885323f6d894974",
      createdBy: "5b4e4b48808c7eebc9f9e827",
      text: "I notice that your explanation is vague."
    },
  },
  answers: {
    accessibleAnswerCount: 2,
  },
  selections: {
    accessibleSelectionCount: 66,
    inaccessibleSelection: {
      _id: '53e12211b48b12793f000b7e'
    },
    accessibleSelection: {
      _id: '53e37f14b48b12793f001097'
    },
  },
  assignments: {
    accessibleAssignmentCount: 1,
    accessibleAssignment: {
      _id: '5b91743a3da5efca74705773',
    },
    inaccessibleAssignment: {
      _id: '5b9146a83add43b868ae9809'
    },
  },
  folders: {
    accessibleFolderCount: 40,
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
    },
  },
  folderSets: {
    accessibleFolderSetCount: 2,
    accessibleFolderSet: {
      _id: '5bec409176124a776f2ff00e'
    },
    validFolderSet: {
      name: 'test Folder Set',
      privacySetting: 'M',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
    },
    modifiableFolderSet: {
      _id: '5bb814d19885323f6d894975',
      name: 'Reasonable'
    },
    inaccessibleFolderSet: {
      _id: '5be5c5b1528e311460c0dd9e'
    }
  },
  sections: {
    accessibleSectionCount: 1,
    inaccessibleSection: {
      _id: '5b913e723add43b868ae9804'
    },
    accessibleSection: {
      _id: '5b9149a32ecaf7c30dd4748f'
    },
    validSection: {
      name: 'A test section',
      createdBy: '5b4e4b48808c7eebc9f9e827',
      assignments: [],
      students: [],
      teachers: [],
    },
    modifiableSection: {
      _id: '5b9149a32ecaf7c30dd4748f',
      name: `Summer's Algebra 2 1st Period`
    },
  },
  problems: {
    accessibleProblemCount: 17,
    accessibleProblem: {
      _id: '5ba7c3cb1359dc2f6699f2b3',
    },
    inaccessibleProblem: {
      _id: '5b4e2e56be1e18425515308c'
    },
    validProblem: {
      title: 'test math problem',
      text: 'This is a problem',
      categories: [],
      createdBy: '5b4e4b48808c7eebc9f9e827',
    },
    invalidProblem: {
      title: '',
      puzzleId: '',
      text: '',
      categories: []
    },
    modifiableProblem: {
      _id: ''
    }
  }
};



const studentMT = {
  details: {
    _id: '5b914a102ecaf7c30dd47492',
    testDescriptionTitle: 'Student',
    username: 'tracyc',
    password: 'tracyc',
    name: 'Tracy Collins',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'S',
  },
  users: {
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
  },
  submissions: {
    accessibleSubmissionCount: 0,
    unaccessibleSubmission: {
      _id: "53e36522729e9ef59ba7f4df"
    },
  },
  comments: {
    accessibleCommentCount: 0,
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
  },
  answers: {
    accessibleAnswerCount: 1,
  },
  selections: {
    accessibleSelectionCount: 0,
    inaccessibleSelection: {
      _id: '5bbb9d57c2aa0a1696840ce9'
    },
  },
  assignments: {
    accessibleAssignmentCount: 1,
    accessibleAssignment: {
      _id: '5b91743a3da5efca74705773',
    },
    inaccessibleAssignment: {
      _id: '5b9146a83add43b868ae9809'
    },
  },
  folders: {
    accessibleFolderCount: 0,
    inaccessibleFolder: {
      _id: '53e36cdbb48b12793f000d43'
    },
    validFolder: {
      name: 'test folder',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
      workspace: '5bb814d19885323f6d894974'
    },
    // TODO: update this when seeder data is added for collabWorkspaces for students
    modifiableFolder: {
      _id: '5bb814d19885323f6d894975',
      name: 'Reasonable'
    },
  },
  sections: {
    accessibleSectionCount: 1,
    inaccessibleSection: {
      _id: '5b1e7b2aa5d2157ef4c91108'
    },
    accessibleSection: {
      _id: '5b9149a32ecaf7c30dd4748f'
    },
    validSection: {
      name: 'test section',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
    },
    modifiableSection: {
      _id: '53e11604b48b12793f0004ee',
      name: 'Correct'
    },
  },
  folderSets: {
    accessibleFolderSetCount: 2,
    accessibleFolderSet: {
      _id: '5bec409176124a776f2ff00e'
    },
    validFolderSet: {
      name: 'test Folder Set',
      privacySetting: 'M',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
    },
    modifiableFolderSet: {
      _id: '5bb814d19885323f6d894975',
      name: 'Reasonable'
    },
    inaccessibleFolderSet: {
      _id: '5be5c5b1528e311460c0dd9e'
    }
  },
  problems: {
    accessibleProblemCount: 19,
    accessibleProblem: {
      _id: '5b9173e23da5efca74705772',
    },
    inaccessibleProblem: {
      _id: '5b4e2e56be1e18425515308c'
    },
    validProblem: {
      title: 'test math problem',
      text: 'This is a problem',
      categories: [],
      createdBy: '5b914a102ecaf7c30dd47492',
    },
    invalidProblem: {
      title: '',
      puzzleId: '',
      text: '',
      categories: []
    }
  }
};

const teacherActingStudent = {
  details: {
    _id: '5b99146e25b620610ceead75',
    testDescriptionTitle: 'Teacher acting as Student',
    username: 'actingstudent',
    name: 'Al Allison',
    password: 'allison',
    organization: '5b4e4d5f808c7eebc9f9e82c',
    accountType: 'T',
    actingRole: 'student',
  },
  users: {
    accessibleUser: {
      _id: '5b914a102ecaf7c30dd47492',
      username: 'tracyc',
      name: 'Tracy Collins',
      organization: '5b4e4d5f808c7eebc9f9e82c',
      accountType: 'S',
      createdBy: '5b4e4b48808c7eebc9f9e827',
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
      _id: '5b99146e25b620610ceead75',
      username: 'actingstudent',
      accountType: 'T'
    },
  },
  submissions: {
    accessibleSubmissionCount: 0,
    unaccessibleSubmission: {
      _id: "53e36522729e9ef59ba7f4db"
    },
  },
  comments: {
    accessibleCommentCount: 0,
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
  },
  answers: {
    accessibleAnswerCount: 0,
  },
  selections: {
    accessibleSelectionCount: 0,
    inaccessibleSelection: {
      _id: '5bbb9d57c2aa0a1696840ce9'
    },
  },
  assignments: {
    accessibleAssignmentCount: 1,
    accessibleAssignment: {
      _id: '5b91743a3da5efca74705773',
    },
    inaccessibleAssignment: {
      _id: '5b9146a83add43b868ae9809'
    },
  },
  folders: {
    accessibleFolderCount: 0,
    inaccessibleFolder: {
      _id: '53e36cdbb48b12793f000d43'
    },
    validFolder: {
      name: 'test folder',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
      workspace: '5bb814d19885323f6d894974'
    },
    // TODO: update this when seeder data is added for collabWorkspaces for students
    modifiableFolder: {
      _id: '5bb814d19885323f6d894975',
      name: 'Reasonable'
    },
  },
  folderSets: {
    accessibleFolderSetCount: 2,
    accessibleFolderSet: {
      _id: '5bec409176124a776f2ff00e'
    },
    validFolderSet: {
      name: 'test Folder Set',
      privacySetting: 'M',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
    },
    modifiableFolderSet: {
      _id: '5bb814d19885323f6d894975',
      name: 'Reasonable'
    },
    inaccessibleFolderSet: {
      _id: '5be5c5b1528e311460c0dd9e'
    }
  },
  sections: {
    accessibleSectionCount: 1,
    inaccessibleSection: {
      _id: '5b913e723add43b868ae9804'
    },
    accessibleSection: {
      _id: '5b9149a32ecaf7c30dd4748f'
    },
    validSection: {
      name: 'test section',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
    },
    modifiableSection: {
      _id: '53e11604b48b12793f0004ee',
      name: 'Correct'
    },
  },
  problems: {
    accessibleProblemCount: 19,
    accessibleProblem: {
      _id: '5b9173e23da5efca74705772',
    },
    inaccessibleProblem: {
      _id: '5b4e2e56be1e18425515308c'
    },
    validProblem: {
      title: 'test math problem',
      text: 'This is a problem',
      categories: [],
      createdBy: '5b99146e25b620610ceead75',
      privacySetting: 'M'
    },
    invalidProblem: {
      title: '',
      puzzleId: '',
      text: '',
      categories: []
    }

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