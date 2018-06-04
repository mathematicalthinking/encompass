/**
  * # Test Fixtures
  * @description This is the mock data to be used in REST API test
**/

module.exports = {
  answer: {
    validAnswer: {
      studentName: '',
      answer: '',
      explanation: '',
      problemId: '',
      sectionId: '',
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
    validProblem: {
      title: '',
      puzzleId: '', // if this is coming from PoWs otherwise null
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
      sectionId: '',
      name: '',
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
