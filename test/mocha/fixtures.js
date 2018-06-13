/**
  * # Test Fixtures
  * @description This is the mock data to be used in REST API test
**/

module.exports = {
  answer: {
    _id: '5b1e7abfa5d2157ef4c910b8',
    validAnswer: {
      studentName: 'bill',
      answer: '4',
      explanation: 'I put 2 and 2 together',
      problemId: '5b0d939baca0b80f78807cf5',
      sectionId: '5b15522cdfa1745d8ca72277',
    },
    invalidAnswer: {
      id: '',
      studentName: '',
      answer: '',
      explanation: '',
      problemId: '',
      sectionId: '',
    }
  },
  category: {
    name: ''
  },
  problem: {
    _id: '5b1e7a0ba5d2157ef4c91028',
    validProblem: {
      title: 'test math problem',
      puzzleId: '400000', // if this is coming from PoWs otherwise null
      categories: []
    },
    invalidProblem: {
      title: '',
      puzzleId: '', // if this is coming from PoWs otherwise null
      categories: []
    }
  },
  section: {
    validSection: {
      _id: '5b15522cdfa1745d8ca72277',
      name: 'MIKEs test class',
      problems: [],
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
};
