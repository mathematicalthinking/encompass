const moment = require('moment');
const seededAssignments = require('../../../seeders/assignments');
const seededSections = require('../../../seeders/sections');

module.exports = {
  withLinkedWorkspaces: {
    valid: {
      // ssmith
      section: '5b9149a32ecaf7c30dd4748f',
      name: `Summer's Test with Linked Ws`,
      createdBy: '5b4e4b48808c7eebc9f9e827',
      students: [
        "5b9149c22ecaf7c30dd47490",
        "5b9149f52ecaf7c30dd47491",
        "5b914a102ecaf7c30dd47492",
        "5b99146e25b620610ceead75",
        "5b4e5180a2eed65e2434d475"
    ],
    answers: [],
    problem: '53a447ae32f286324000033b',
    linkedWorkspacesRequest: {
      doCreate: true,
    },
    parentWorkspceRequest: {
    },
    }
  },
  withoutName: {
    valid: {
      body: {
        section: '5b9149a32ecaf7c30dd4748f',
        name: '',
        createdBy: '5b4e4b48808c7eebc9f9e827',
        students: [
          "5b9149c22ecaf7c30dd47490",
          "5b9149f52ecaf7c30dd47491",
          "5b914a102ecaf7c30dd47492",
          "5b99146e25b620610ceead75",
          "5b4e5180a2eed65e2434d475"
      ],
      answers: [],
      problem: '53a447ae32f286324000033b',
      doCreateLinkedWorkspaces: false,
      },
      linkedWorkspaceRequest: {
        doCreate: false,
      },
      expectedResultName: `Summer's Org Problem / ${moment(new Date()).format('MMM Do YYYY')}`
    }
  },
  pdAdmin: {
    toModify: {
      assignment: seededAssignments.find(assn => assn._id.toString() === '5b9146a83add43b868ae9809'),
      newSection: seededSections.find(section => section._id.toString() === '5b1e7b2aa5d2157ef4c91108' )
    }

  }
};