const moment = require('moment');

module.exports = {
  teacher: {
    username: 'mtgteacher',
    password: 'test',
    parentWorkspace: {
      name: `
      Parent Workspace: Morty's Public / ${moment(new Date()).format('MMM Do YYYY')} `,
      initialFolders: 3,
    }
  },
  student1: {
    username: 'mtgstudent1',
    password: 'test',
    firstResponse: {
      briefSummary: 'this is my summary',
      explanation: 'here is my explanation'
    },
    linkedWs: {
      name: `mtgstudent1: Morty's Public / ${moment(new Date()).format('MMM Do YYYY')} (MTG Period 1)`,
    }
  },
  student2: {
    username: 'mtgstudent2',
    password: 'test',
    firstResponse: {
      briefSummary: 'this is my summary as student2',
      explanation: 'here is my explanation as student2'
    },
    linkedWs: {
      name: `mtgstudent2: Morty's Public / ${moment(new Date()).format('MMM Do YYYY')} (MTG Period 1)`,
    }
  },
  newAssignment: {
    name: `Morty's Public / ${moment(new Date()).format('MMM Do YYYY')}`,
    section: {
      id: '5c6eb4d49852e5710311d637',
      name: 'MTG Period 1',
    },
    problem: {
      id: '5b4e2e6cbe1e18425515308d',
      name: `Morty's Public`,
    },
    students: [
      {
        username: 'mtgstudent1',

      },
      {
        username: 'mtgstudent2'
      },
      {
        username: 'mtgstudent3'
      }
    ]
  }
};