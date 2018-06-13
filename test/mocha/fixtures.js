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
      puzzleId: '400000',
      categories: []
    },
    invalidProblem: {
      title: '',
      puzzleId: '',
      categories: []
    }
  },
  section: {
    _id: '5b1e7b2aa5d2157ef4c91108',
    validSection: {
      name: 'A test section',
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
  teacher: {
    _id: '5b1e7bf9a5d2157ef4c911a6'
  },
  student: {
    name: 'David T.'
  }
};
