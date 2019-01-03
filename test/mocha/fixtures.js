/**
  * # Test Fixtures
  * @description This is the mock data to be used in REST API test
**/

module.exports = {
  answer: {
    _id: '5b1e7abfa5d2157ef4c910b8',
    validAnswer: {
      studentName: 'student1',
      answer: '4',
      explanation: 'I put 2 and 2 together',
      problem: '5b0d939baca0b80f78807cf5',
      section: '5b15522cdfa1745d8ca72277',
      createdBy: '5b368afdca1375a94fabde39',
    },
    invalidAnswer: {
      id: '',
      studentName: '',
      answer: '',
      explanation: '',
      problemId: '',
      sectionId: '',
    },
    updated: {
      studentName: 'student1',
      answer: '4',
      explanation: 'actually Im not sticking with that answer',
      problem: '5b0d939baca0b80f78807cf5',
      section: '5b15522cdfa1745d8ca72277',
      createdBy: '5b368afdca1375a94fabde39',
    }
  },
  category: {
    name: ''
  },
  comment: {
    _id: '53e12507b48b12793f000b91',
    validComment: {
      label: 'wonder',
      text: 'i wonder if thats the best strategy',
      selection: '53a357cd32f286324000004d',
      submission: '53a35784729e9ef59ba7eb54',
      workspace: '53e1156db48b12793f000442',
      useForResponse: true,
      isTrashed: false,
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
    }
  },
  problem: {
    _id: '5b4e25c638a46a41edf1709a',
    validProblem: {
      title: 'test math problem',
      puzzleId: '400000',
      text: 'This is a problem',
      categories: [],
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
    },
    invalidProblem: {
      title: '',
      puzzleId: '',
      text: '',
      categories: []
    },
    duplicateTitle: {
      title: 'alphaBetical  Problem ',
      nonPublic: `Summer's Private Problem`
    },
  },
  assignment: {
    problemId: '5b1e7a0ba5d2157ef4c91028',
    answerId: '5b1e7abfa5d2157ef4c910b8',
    createdBy: '5b1e7bf9a5d2157ef4c911a6',
  },
  section: {
    _id: '5b1e7b2aa5d2157ef4c91108',
    validSection: {
      name: 'A test section',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
      assignments: [],
      students: [],
      teachers: [],
    },
    invalidSection: {
      sectionId: '',
      name: '',
      problems: [],
      students: [],
      teachers: [],
    }
  },
  teacher: {
    _id: '5b1e7bf9a5d2157ef4c911a6'
  },
  student: {
    _id: '5b368dfbca1375a94fabde3a'
  },
  user: {
    _id: '529518daba1cd3d8c4013344',
    validUser: {
      username: 'testUser3',
      name: 'testUser3',
      accountType: 'T',
      password: '$2a$08$Puko.4Ukg3fUVSfQsyhlauvEJ84/ymUidiL7xablVfic59zzC4gFi'
    },
  },
  folder: {
    _id: '53e118f3b48b12793f000a41',
    validFolder: {
      name: 'test folder',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
      workspace: '53e1156db48b12793f000442'
    }
  },
  selection: {
    _id: '53e11942b48b12793f000a5f',
    validSelection: {
      coordinates: 'node-1 2 596 node-1 2 746',
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
      text: 'test selection text',
      submission: '53e1156db48b12793f000430', // this should be switched to answer,
      workspace: '53e1156db48b12793f000442'
    }
  },
  tagging: {
    _id: '53e1194bb48b12793f000a62',
    validTagging: {
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
      workspace: '53e1156db48b12793f000442',
      selection: '53e11b38b48b12793f000ab7',
      folder: '53e11b0ab48b12793f000ab1'
    }
  },
  submission: {
    _id: '53e1156db48b12793f000407',
    validSubmission: {
      createdBy: '5b1e7bf9a5d2157ef4c911a6',
      shortAnswer: 'test short answer',
      longAnswer: 'test long answer',
      status: "SUBMITTED",
      responses: [],
      workspaces: [],
      comments: [],
      selections: [],
      isTrashed: false,
    }
  },

  organization: {
    validOrg: {
      name: 'Valid Test Organization'
    },
    duplicateName: {
      name: 'drexel university'
    },
    existingOrg: {
      _id: '5b4e4d5f808c7eebc9f9e82c',
      createdBy: '5b245760ac75842be3189525'
    }
  }
};

