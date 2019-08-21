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
    outsideCollab: {
      _id: '5b4e4b48808c7eebc9f9e827',
      username: 'ssmith',
    },
    accessibleUserCount: 53,
  },
  submissions: {
    accessibleSubmissionCount: 64,
    accessibleSubmission: {
      _id: "5bb814d19885323f6d894973"
    },
  },
  comments: {
    accessibleCommentCount: 13,
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
    accessibleAnswerCount: 7,
  },
  selections: {
    accessibleSelectionCount: 82,
    accessibleSelection: {
      _id: '5bbb9d57c2aa0a1696840ce9'
    },
  },
  assignments: {
    accessibleAssignmentCount: 3,
    accessibleAssignment: {
      _id: '5b9146a83add43b868ae9809',
    },
  },
  folders: {
    accessibleFolderCount: 54,
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
    accessibleSectionCount: 4,
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
      name: `Summer's Algebra 2 1st Period`,
      teacherToAdd: '5b7321ee59a672806ec903d5',
      newTeachers: ['5b7321ee59a672806ec903d5', '5b4e4b48808c7eebc9f9e827',
      '5b914a802ecaf7c30dd47493'],
      newStudents: [ '5b9149c22ecaf7c30dd47490',
      '5b9149f52ecaf7c30dd47491',
      '5b914a102ecaf7c30dd47492',
      '5b99146e25b620610ceead75',
    '5b72273c5b50ea3fe3d01a0b'],
      studentToAdd:'5b72273c5b50ea3fe3d01a0b'
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
  },
  workspaces: {
    accessibleWorkspacesCount: 7,
    accessibleWorkspace:
      {
        _id: "53e1156db48b12793f000442" ,
        name: 'Feathers and Fur / Period 5 Basic Math',
        submissions: ["53e1156db48b12793f000418", "53e1156db48b12793f00042e", "53e1156db48b12793f000420", "53e1156db48b12793f000425", "53e1156db48b12793f000416", "53e1156db48b12793f000421", "53e1156db48b12793f000432", "53e1156db48b12793f000436", "53e1156db48b12793f00041a", "53e1156db48b12793f00042f", "53e1156db48b12793f00041e", "53e1156db48b12793f000430", "53e1156db48b12793f00043e", "53e1156db48b12793f000419", "53e1156db48b12793f00042d", "53e1156db48b12793f000438", "53e1156db48b12793f00041b", "53e1156db48b12793f000434", "53e1156db48b12793f000417", "53e1156db48b12793f000427", "53e1156db48b12793f000423", "53e1156db48b12793f000440", "53e1156db48b12793f000407", "53e1156db48b12793f000437", "53e1156db48b12793f000422", "53e1156db48b12793f000433", "53e1156db48b12793f000428", "53e1156db48b12793f00043d", "53e1156db48b12793f00042c", "53e1156db48b12793f00041d", "53e1156db48b12793f000439", "53e1156db48b12793f000414", "53e1156db48b12793f00041f", "53e1156db48b12793f00043a", "53e1156db48b12793f000415", "53e1156db48b12793f000426"],
        comments: ["53e12264b48b12793f000b84", "53e12507b48b12793f000b91","5bbbba86a6a7ee1a9a5ebc75"],
        responses: ["5b1aef7ae53645e768926123"],
        taggings: ["53e1194bb48b12793f000a62", "53e11b5eb48b12793f000abb", "53e11eceb48b12793f000b36", "53e11fa8b48b12793f000b48", "53e12250b48b12793f000b83", "53e12518b48b12793f000b92"],
        selections: ["53e11942b48b12793f000a5f", "53e11b38b48b12793f000ab7", "53e11ec4b48b12793f000b34", "53e11f20b48b12793f000b3a", "53e11f82b48b12793f000b44", "53e12158b48b12793f000b68", "53e12211b48b12793f000b7e", "53e1223cb48b12793f000b80", "53e1223eb48b12793f000b81", "53e12503b48b12793f000b90", "5bbbba75a6a7ee1a9a5ebc74",],
        permissions: [],
        feedbackAuthorizers: [],
        folders: ["53e11604b48b12793f0004ee", "53e1165eb48b12793f0005e7", "53e1166db48b12793f0005e9", "53e118f3b48b12793f000a41", "53e11b0ab48b12793f000ab1"],
      }
  },
  responses: {
    accessibleResponsesCount: 8,
    accessibleResponse: {
      _id: "5bec64f7aa4a927d50cd5ba0",
    },
    inaccessibleResponse: {
      _id: ''
    },
    modifiableResponse: {
      _id: ''
    }
  },
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
    outsideCollab: {
      _id: "5b99146e25b620610ceead75",
      username: "actingstudent",
    },
    accessibleUserCount: 31,
  },
  submissions: {
    accessibleSubmissionCount: 55,
    unaccessibleSubmission: {
      _id: "5bb814d19885323f6d894973"
    },
    accessibleSubmission: {
      _id: "53e1156db48b12793f00042d"
    },
  },
  comments: {
    accessibleCommentCount: 8,
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
    accessibleAnswerCount: 4,
  },
  selections: {
    accessibleSelectionCount: 76,
    inaccessibleSelection: {
      _id: '5bbb9d57c2aa0a1696840ce9'
    },
    accessibleSelection: {
      _id: '53e38ac3b48b12793f0010d4'
    },
  },
  assignments: {
    accessibleAssignmentCount: 2,
    accessibleAssignment: {
      _id: '5b9146a83add43b868ae9809',
    },
    inaccessibleAssignment: {
      _id: '5b91743a3da5efca74705773'
    },
  },
  folders: {
    accessibleFolderCount: 41,
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
    accessibleSectionCount: 3,
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
      name: `Morty's Math 101`,
      teacherToAdd: '5b1e7bf9a5d2157ef4c911a6',
      newTeachers: ['5b1e7bf9a5d2157ef4c911a6', '5b245841ac75842be3189526'],
      newStudents: ['5b913ea33add43b868ae9805',
      '5b913eaf3add43b868ae9806',
      '5b913ebe3add43b868ae9807','5b72273c5b50ea3fe3d01a0b'],
      studentToAdd: '5b72273c5b50ea3fe3d01a0b'
    },
  },
  problems: {
    accessibleProblemCount: 19,
    accessibleProblem: {
      _id: '5b1e7a0ba5d2157ef4c91028',
    },
    inaccessibleProblem: {
      _id: '5b4e2e56be1e18425515308c'
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
    },
    outsideOrgCollabProblem: {
      _id: '5b9173e23da5efca74705772',
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
  },
  workspaces: {
    accessibleWorkspacesCount: 3,
    accessibleWorkspace:
      {
        _id: '5bec36958c73047613e2f34e' ,
        name: `Summer's Test Workspace 1`,
        submissions: ["5bec36958c73047613e2f34c",
        "5bec36958c73047613e2f34d"],
        comments: ["5bec375d8c73047613e2f35e",
        "5bec37708c73047613e2f35f",
        "5bec37a08c73047613e2f364",
        "5bec37e38c73047613e2f366"],
        responses: ["5c87ddf1a2fb212cd72de56a",
        "5c87de03a2fb212cd72de56c"],
        taggings: ["5bec37f48c73047613e2f367","5bec38018c73047613e2f368","5bec38338c73047613e2f36b","5bec386a8c73047613e2f36d"],
        selections: ["5bec373d8c73047613e2f35c",
        "5bec37408c73047613e2f35d",
        "5bec37838c73047613e2f361",
        "5bec37a78c73047613e2f365"],
        permissions: [],
        feedbackAuthorizers: [],
        folders: ["5bec36c58c73047613e2f352",
        "5bec36ca8c73047613e2f353",
        "5bec36cd8c73047613e2f354",
        "5bec36dd8c73047613e2f355",
        "5bec36e98c73047613e2f356",
        "5bec36f78c73047613e2f357",
        "5bec37048c73047613e2f358",
        "5bec37108c73047613e2f359",
        "5bec371f8c73047613e2f35a"]
      },
      inaccessibleWorkspace: {
        _id: '5bb814d19885323f6d894974',
      },
  },
  responses: {
    accessibleResponsesCount: 3,
    accessibleResponse: {
      _id: "5b1aef7ae53645e768926123",
    },
    inaccessibleResponse: {
      _id: '',
    },
    modifiableResponse: {
      _id: ''
    }
  },
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
    outsideCollab: {
      _id: "5b1e7bf9a5d2157ef4c911a6",
      username: "drex",
    },
    outsideStudent: {
      _id: "5b4e5180a2eed65e2434d475",
      username: "testUser2",
    },
    accessibleUserCount: 22,
  },
  submissions: {
    accessibleSubmissionCount: 22,
    unaccessibleSubmission: {
      _id: "53e1156db48b12793f000417"
    },
    accessibleSubmission: {
      _id: "53e36522729e9ef59ba7f4da"
    },
  },
  comments: {
    accessibleCommentCount: 8,
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
    accessibleSelectionCount: 69,
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
    accessibleFolderCount: 49,
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
      name: `Summer's Algebra 2 1st Period`,
      teacherToAdd: '5b245760ac75842be3189525',
      newTeachers: ['5b4e4b48808c7eebc9f9e827',
      '5b914a802ecaf7c30dd47493','5b245760ac75842be3189525'],
      newStudents: ['5b9149c22ecaf7c30dd47490',
      '5b9149f52ecaf7c30dd47491',
      '5b914a102ecaf7c30dd47492',
      '5b99146e25b620610ceead75','5b914a802ecaf7c30dd47493'],
      studentToAdd:'5b914a802ecaf7c30dd47493'
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
  },
  workspaces: {
    accessibleWorkspacesCount: 4,
    accessibleWorkspace:
      {
        _id: '5bb814d19885323f6d894974' ,
        name: `Summer's Org Problem Workspace`,
        submissions: ['5bb814d19885323f6d894973'],
        comments: ['5bbb9d86c2aa0a1696840ceb'],
        responses: [],
        taggings: ['5bbb9d5dc2aa0a1696840cea'],
        selections: ['5bbb9d57c2aa0a1696840ce9'],
        permissions: [],
        feedbackAuthorizers: [],
        folders: ["5bb814d19885323f6d894975",
        "5bb814d19885323f6d894976",
        "5bb814d19885323f6d894977",
        "5bb814d19885323f6d894978"],
      },
      inaccessibleWorkspace: {
        _id: '53e1156db48b12793f000442',
      },
  },
  responses: {
    accessibleResponsesCount: 5,
    accessibleResponse: {
      _id: "5bec6497aa4a927d50cd5b9b",
    },
    inaccessibleResponse: {
      _id: "5b1aef7ae53645e768926123",
    },
    modifiableResponse: {
      _id: ''
    }
  },
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
    accessibleUserCount: 9,
    modifiableUser: {
      _id: '5b914a102ecaf7c30dd47492',
      username: 'tracyc',
      accountType: 'S'
    },
    outsideCollab: {
      _id: "5b1e7bf9a5d2157ef4c911a6",
      username: "drex",
    },
    outsideStudent: {
      _id: "5b4e5180a2eed65e2434d475",
      username: "testUser2",
    },
  },
  submissions: {
    accessibleSubmissionCount: 4,
    unaccessibleSubmission: {
      _id: "53e36522729e9ef59ba7f4df"
    },
  },
  comments: {
    accessibleCommentCount: 5,
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
    accessibleAnswerCount: 2,
    firstRevision: {
      "answer" : "This is my 2nd try",
      "explanation" : "<p>This is my 2nd explanation.</p>",
      "createdBy" : "5b914a102ecaf7c30dd47492",
      "problem" : "5b9173e23da5efca74705772",
      "explanationImage" : null,
      "section" : "5b9149a32ecaf7c30dd4748f",
      "priorAnswer" : "5bb813fc9885323f6d894972",
      "assignment" : "5b91743a3da5efca74705773",
      "isSubmitted" : true,
      "students" : [
          "5b914a102ecaf7c30dd47492"
      ],
      "workspacesToUpdate":["5bec36958c73047613e2f34e"]
    }
  },
  selections: {
    accessibleSelectionCount: 6,
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
    accessibleFolderCount: 13,
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
    accessibleProblemCount: 17,
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
  },
  workspaces: {
    accessibleWorkspacesCount: 3,
    accessibleWorkspace:
      {
        _id: '5bec36958c73047613e2f34e/' ,
        name: `Summer's Test Workspace 1`,
        submissions: ["5bec36958c73047613e2f34c",],
        comments: ["5bec375d8c73047613e2f35e",
        "5bec37708c73047613e2f35f",],
        responses: ["5bec64f7aa4a927d50cd5ba0", "5c87de03a2fb212cd72de56c"],
        taggings: [],
        selections: ["5bec373d8c73047613e2f35c",
        "5bec37408c73047613e2f35d",],
        permissions: [],
        folders: [],
        feedbackAuthorizers: [],
      },
      inaccessibleWorkspace: {
        _id: '5bb814d19885323f6d894974'
      } ,
  },
  responses: {
    accessibleResponsesCount: 3,
    accessibleResponse: {
      _id: "5bec64f7aa4a927d50cd5ba0",
    },
    inaccessibleResponse: {
      _id: "5bec6497aa4a927d50cd5b9b",
    },
    modifiableResponse: {
      _id: ''
    }
  },
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
    accessibleUserCount: 9,
    modifiableUser: {
      _id: '5b99146e25b620610ceead75',
      username: 'actingstudent',
      accountType: 'T'
    },
    outsideCollab: {
      _id: "5b1e7bf9a5d2157ef4c911a6",
      username: "drex",
    },
    outsideStudent: {
      _id: "5b4e5180a2eed65e2434d475",
      username: "testUser2",
    },
  },
  submissions: {
    accessibleSubmissionCount: 2,
    unaccessibleSubmission: {
      _id: "53e36522729e9ef59ba7f4db"
    },
  },
  comments: {
    accessibleCommentCount: 4,
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
    accessibleAnswerCount: 2,
  },
  selections: {
    accessibleSelectionCount: 4,
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
    accessibleProblemCount: 17,
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

  },
  workspaces: {
    accessibleWorkspacesCount: 1 ,
    accessibleWorkspace:
      {
        _id: '5bec36958c73047613e2f34e/' ,
        name: `Summer's Test Workspace 1`,
        submissions: ["5bec36958c73047613e2f34c",
        "5bec36958c73047613e2f34d"],
        comments: ["5bec375d8c73047613e2f35e",
        "5bec37708c73047613e2f35f",
        "5bec37a08c73047613e2f364",
        "5bec37e38c73047613e2f366"],
        responses: [],
        taggings: [],
        selections: ["5bec373d8c73047613e2f35c",
        "5bec37408c73047613e2f35d",
        "5bec37838c73047613e2f361",
        "5bec37a78c73047613e2f365"],
        permissions: [],
        folders: [],
        feedbackAuthorizers: [],
      },
      inaccessibleWorkspace: {
        _id: '53e36522b48b12793f000d3b',
      },
  },
  responses: {
    accessibleResponsesCount: 0,
    accessibleResponse: {
      _id: "5bec6497aa4a927d50cd5b9b",
    },
    inaccessibleResponse: {
      _id: "5b1aef7ae53645e768926123" ,
    },
    modifiableResponse: {
      _id: ''
    }
  },
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