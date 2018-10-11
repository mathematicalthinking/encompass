module.exports = {
  pdAdminDrexel: {
    testDescriptionTitle: 'PD Admin',
    username: 'pdadmin',
    password: 'pdadmin',
    accountType: 'P',
    organization: 'Drexel University',
    sections: {
      own: {
       count: 0
      },
      collab: {
        count: 0
      },
      org: {
        count: 2
      },
      testExample: {
        _id: '5b913e723add43b868ae9804',
        name: `Morty's Math 101`,
        teachers: ['morty'],
        students: ['alex8', 'sam3', 'jamie4']
      },
      newSection: {
        name: `pdAdminDrexel Test Section`,
        teacher: `morty`,
      }
     }

  },

  teacherMT: {
    testDescriptionTitle: 'Teacher',
    username: 'ssmith',
    password: 'ssmith',
    accountType: 'T',
    organization: 'Mathematical Thinking',
    sections: {
      own: {
       count: 1
      },
      collab: {
        count: 0
      },
      testExample: {
        _id: '5b9149a32ecaf7c30dd4748f',
        name: `Summer's Algebra 2 1st Period`,
        teachers: ['ssmith', 'teachertaylor']
      },
      newSection: {
        name: 'Summer Test Section'
      }
     }
  },

  admin: {
    testDescriptionTitle: 'Admin',
    username: 'rick',
    password: 'sanchez',
    accountType: 'A',
    sections: {
      own: {
       count: 1
      },
      collab: {
        count: 0
      },
      all: {
        count: 2
      },
      testExample: {
        _id: '5b1e7b2aa5d2157ef4c91108',
        name: 'Drexel University',
        teachers: ['drex']
      },
      newSection: {
        name: 'admin test section',
        teacher: 'ssmith'
      }
     }
  },

  studentMT: {
    testDescriptionTitle: 'Student',
    username: 'tracyc',
    password: 'tracyc',
    organization: 'Mathematical Thinking',
    accountType: 'S',
    sections: {
      own: {
       count: 1
      },
      collab: {
        count: 0
      },
      org: {
        count: 0
      },
      testExample: {
        _id: '5b9149a32ecaf7c30dd4748f',
        name: `Summer's Algebra 2 1st Period`,
        teachers: ['ssmith', 'teachertaylor']
      }
     }
  },

  teacherActingStudent: {
    testDescriptionTitle: 'Teacher acting as Student',
    username: 'actingstudent',
    password: 'allison',
    accountType: 'T',
    organization: 'Mathematical Thinking',
    actingRole: 'student',
    sections: {
     own: {
      count: 1
     },
     collab: {
       count: 0
     },
     org: {
       count: 0
     },
     testExample: {
      _id: '5b9149a32ecaf7c30dd4748f',
      name: `Summer's Algebra 2 1st Period`,
      teachers: ['ssmith', 'teachertaylor']
    }
    }
  }

};