module.exports = {
  pdAdminDrexel: {
    testDescriptionTitle: 'PD Admin',
    _id: '5b7321ee59a672806ec903d5',
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
     },
    problems : {
      public: {
        count: 16
      },
      mine : {
        count: 1
      },
      org: {
        total: 11,
        recommended: 3,
        members: 10,
      },
      category: {
        total: 3,
        k: 2,
        ee: 1,
        noSub: 2,
      },
      search: {
        public: 8,
        mine: 0,
        org: 7,
        title: 0,
        clear: 1,
      }
    }
  },

  teacherMT: {
    testDescriptionTitle: 'Teacher',
    _id: '5b4e4b48808c7eebc9f9e827',
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
     },
    problems : {
      public: {
        count: 14
      },
      mine: {
        count: 5
      },
      org: {
        total: 6,
        recommended: 2,
        members: 4,
      },
      category: {
        total: 3,
        k: 2,
        ee: 1,
        noSub: 2,
      },
      search: {
        public: 7,
        mine: 5,
        org: 6,
        title: 1,
        clear: 5,
      }
    }
  },

  admin: {
    testDescriptionTitle: 'Admin',
    _id: '5b245760ac75842be3189525',
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
    },
    problems: {
      public: {
        count: 16
      },
      mine: {
        count: 4
      },
      org: {
        total: 11,
        recommended: 3,
        members: 10,
      },
      category: {
        total: 3,
        k: 2,
        ee: 1,
        noSub: 2,
      },
      all: {
        total: 23,
        org: {
          total: 6,
          recommended: 2,
          members: 4,
        },
        creator: 8,
        pows: {
          total: 6,
          public: 5,
          private: 1,
        }
      },
      search: {
        all: 12,
        public: 8,
        mine: 2,
        org: 7,
        title: 1,
        clear: 22,
      }
    }
  },

  studentMT: {
    testDescriptionTitle: 'Student',
    _id: '5b914a102ecaf7c30dd47492',
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
    _id: '5b99146e25b620610ceead75',
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