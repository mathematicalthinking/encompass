const { format } = require('date-fns');

module.exports = {
  teacher: {
    username: 'mtgteacher',
    password: 'test',
    parentWorkspace: {
      name: `
      Parent Ws Custom: Morty's Public / ${format(new Date(), 'MMM do yyyy')} `,
      initialFolders: 4,
    },
    linkedWs: {
      name: `mtgteacher: Morty's Public / ${format(
        new Date(),
        'MMM do yyyy'
      )} (MTG Period 1)`,
    },
  },
  student1: {
    username: 'mtgstudent1',
    password: 'test',
    firstResponse: {
      briefSummary: 'this is my summary',
      explanation: 'here is my explanation',
    },
    linkedWs: {
      name: `mtgstudent1: Morty's Public Custom / ${format(
        new Date(),
        'MMM do yyyy'
      )} (MTG Period 1)`,
      newFolder: {
        name: 'curious',
      },
      newComment: {
        text: 'I notice you did it this way...',
      },
    },
  },
  student2: {
    username: 'mtgstudent2',
    password: 'test',
    firstResponse: {
      briefSummary: 'this is my summary as student2',
      explanation: 'here is my explanation as student2',
    },
    linkedWs: {
      name: `mtgstudent2: Morty's Public Custom / ${format(
        new Date(),
        'MMM do yyyy'
      )} (MTG Period 1)`,
      newFolder: {
        name: 'interesting',
      },
      newComment: {
        text: 'I notice that I am student 2...',
      },
    },
  },
  student3: {
    username: 'mtgstudent2',
    password: 'test',
    linkedWs: {
      name: `mtgstudent3: Morty's Public Custom / ${format(
        new Date(),
        'MMM do yyyy'
      )} (MTG Period 1)`,
    },
  },
  newAssignment: {
    name: `Morty's Public / ${format(new Date(), 'MMM do yyyy')}`,
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
        username: 'mtgstudent2',
      },
      {
        username: 'mtgstudent3',
      },
    ],
    linkedWsName: `Morty's Public Custom / ${format(
      new Date(),
      'MMM do yyyy'
    )} (MTG Period 1)`,
    parentWsName: `Parent Ws Custom: Morty's Public / ${format(
      new Date(),
      'MMM do yyyy'
    )}`,
  },
};
