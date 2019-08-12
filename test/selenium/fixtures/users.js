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
        public: 12,
        mine: 1,
        org: 10,
        title: 1,
        clear: 1,
      },
      privacy: {
        total: 1,
        public: 1,
        private: 0,
      },
      status: {
        total: 16,
        pending: 5,
        flagged: 2,
        approved: 11,
      }
    },
    problemInfo: {
      selector: '#problem-list-ul li:first-child .item-section.name span:first-child',
      privacySetting: 'Everyone',
      title: 'How High Is Enough?',
      createDate: '09/26/2018',
      statement: 'A narrow strip of very flexible elastic is firmly fastened to a wooden table top at two points (A and B) 30 centimeters apart. While the strip lies FLAT on the table, a point C is located that divides AB in a 1 : 4 ratio.\nYou now take hold of the strip at point C and begin slowly lifting it vertically. As you do this, the elastic segments AC and BC stretch out and form an obtuse angle.\nAs you lift higher, the measurement of the angle decreases. If you go sufficiently high, you will have an acute angle. But at some moment in this process, there will be a height at which angle ACB is a right angle.\nPlease tell me that height.\nExtra: What is the perimeter of this triangle ACB? [Recall that AC and CB are made of the elastic strip, whereas AB is merely the undrawn line on the table top.] Give your answer rounded to the nearest millimeter.',
      status: 'approved',
      author: 'J.K. Rowling',
      categories: ['CCSS.Math.Content.1.MD.A.2', 'CCSS.Math.Content.5.G.A', 'CCSS.Math.Content.8.G.B.6'],
      categoryDesc: 'express the length of an object as a whole number of length units, by laying multiple copies of a shorter object (the length unit) end to end; understand that the length measurement of an object is the number of same-size length units that span it with no gaps or overlaps.',
      keywords: ['math', 'measuring'],
      additionalInfo: 'This problem has additional info for testing',
      copyright: 'National Council of Teachers of Mathematics',
      sharingAuth: 'Used with the permission of NCTM.',
    },
    problemEdit: {
      privacySetting: 'Everyone',
      title: 'Test Edit Problem',
      statement: 'Test Edit Problem Content',
      status: 'pending',
      author: 'Test Problem Author',
      copyright: 'National Council of Teachers of Mathematics',
      sharingAuth: 'Used with the permission of NCTM.',
      copyright2: 'Test Problem Copyright',
      sharingAuth2: 'Test Problem Sharing Auth',
      keywordsLength: 4,
      categoriesLength: 2,
      additionalInfo: 'This problem has additional info for testing',
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
        public: 10,
        mine: 5,
        org: 6,
        title: 1,
        clear: 5,
      },
      privacy: {
        total: 5,
        public: 4,
        private: 1,
      },
      status: {
        total: 14,
        pending: 3,
        flagged: 0,
        approved: 11,
      }
    },
    problemInfo: {
      selector: '#problem-list-ul li:nth-child(2) .item-section.name span:first-child',
      privacySetting: 'My Organization',
      title: `Summer's Org Problem`,
      createDate: '09/06/2018',
      statement: `This is Summer's org problem`,
      status: 'approved',
      author: 'Charles Dickens',
      keywords: ['graphing', 'testing'],
      origin: "summer's private problem",
    },
    problemEdit: {
      privacySetting: 'Everyone',
      title: 'Test Edit Problem',
      statement: 'Test Edit Problem Content',
      status: 'pending',
      author: 'Test Problem Author',
      copyright2: 'Test Problem Copyright',
      sharingAuth2: 'Test Problem Sharing Auth',
      keywordsLength: 4,
      categoriesLength: 1,
      additionalInfo: '',
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
        count: 3
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
        all: 17,
        public: 12,
        mine: 3,
        org: 10,
        title: 1,
        clear: 22,
      },
      privacy: {
        total: 4,
        public: 3,
        private: 1,
      },
      status: {
        total: 16,
        pending: 5,
        flagged: 2,
        approved: 11,
      }
    },
    problemInfo: {
      selector: '#problem-list-ul li:nth-child(3) .item-section.name span:first-child',
      privacySetting: 'Just Me',
      title: `Rick's Private`,
      createDate: '09/04/2018',
      statement: `And have to a do cognitive their wasn't were pity from eye then and in volumes got sure with belly treble-range to they train average she the of place her and got being into even by such the their in a field large is into than an hills taken preparations at create the if sitting as was brothers slept greediness based a behind the dry laid assumed trusted sleeping least plan text flatter know line constructing bad it enough men, the time then fur was have the place working designer leave the relations apartment, seven. Much have way but is.`,
      status: 'approved',
      author: 'Steve Jobs',
      selector2: '#problem-list-ul li:first-child .item-section.name span:first-child',
      org: 'drexel university',
      status2: 'flagged',
      flagReason: 'reason: inappropriate content',
      flagDetails: 'by morty on oct 21st 2018',
      additionalInfo: 'Be careful!',
      creator: 'rick',
    },
    problemEdit: {
      privacySetting: 'Everyone',
      title: 'Test Edit Problem',
      statement: 'Test Edit Problem Content',
      status: 'approved',
      author: 'Test Problem Author',
      copyright: 'Apple Corps',
      sharingAuth: 'stolen goods',
      copyright2: 'Test Problem Copyright',
      sharingAuth2: 'Test Problem Sharing Auth',
      keywordsLength: 2,
      categoriesLength: 1,
      additionalInfo: 'Be careful!',
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
     },
     assignments: {
      own: {
        count: 1
       },
       answers: {
         count: 1,
       },
       testExample: {
        _id: '5b91743a3da5efca74705773',
        name: `Summer's Org Problem / Sep 6th 2018`,
        problemName: `Summer's Private Problem`,
        assignedDate: 'Sep 6th 2018',
        dueDate: 'Nov 30th 2018',
        className: `Summer's Algebra 2 1st Period`,
        problemStatement: `This is Summer's private problem`

      },
      submitting: {
        isRevision: true,
        oldAnswer: {
          explanation: 'This is my explanation.',
          briefSummary: 'This is a brief summary of my thoughts.',
          contributors: ['tracyc']
        },
        newAnswer: {
          explanation: 'This is my second explanation.',
          briefSummary: 'This is a brief summary of my thoughts.',
          contributors: ['tracyc'],
          workspacesToUpdate: ['5bec36958c73047613e2f34e'],
        }
      },
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
    },
    assignments: {
      own: {
        count: 1
       },
       answers: {
        count: 0
       },
       testExample: {
        _id: '5b91743a3da5efca74705773',
        name: `Summer's Org Problem / Sep 6th 2018`,
        problemName: `Summer's Private Problem`,
        assignedDate: 'Sep 6th 2018',
        dueDate: 'Nov 30th 2018',
        className: `Summer's Algebra 2 1st Period`,
        problemStatement: `This is Summer's private problem`,
      },
      submitting: {
        isRevision: false,
        oldAnswer: null,
        newAnswer: {
          explanation: 'This is my first explanation.',
          briefSummary: 'This is a brief summary.',
          contributors: ['actingstudent'],
        }
      }
    }
  }

};