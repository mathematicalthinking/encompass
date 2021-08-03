this.store').findAll('category.then((categories) => {

let gradesArr = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "HSS", "HSN", "HSG", "HSF", "HSA"];
  let grades = {};
  for (let g of gradesArr) {
    grades[g] = g;
  }
  let cats = categories.toArray();
  let test = cats.map((c) => {
  let description = c.get('description');
  let url = c.get('url');

  let identifier = c.get('identifier');
  let id = c.id;
  return {
      description, url, identifier, id
    };
  });

  let topLevel = test.filter((cat) => {
    let identifier = cat.identifier;
    let splitByDot = identifier.split('.');
    let withoutBeginning = splitByDot.slice(3);
    let nestedLevel = withoutBeginning.length;
    let first = withoutBeginning[0];
    return !first.includes('MP') && nestedLevel === 1;
  });
  let withDomains = topLevel.map((obj) => {
    obj.domains = [];
    return obj;
  });

  let secondLevel = test.filter((cat) => {
    let identifier = cat.identifier;
    let splitByDot = identifier.split('.');
    let withoutBeginning = splitByDot.slice(3);
    let nestedLevel = withoutBeginning.length;
    let first = withoutBeginning[0];
    return !first.includes('MP') && nestedLevel === 2;
  });

  let withTopics = secondLevel.map((obj) => {
    obj.topics = [];
    return obj;
  });

  withTopics.forEach((obj) => {
    let identifier = obj.identifier;
    let splitByDot = identifier.split('.');
    let parentIdent = splitByDot.slice(0, 4).join('.');

    withDomains.forEach((domainObj) => {
      if (domainObj.identifier === parentIdent) {
        domainObj.domains.push(obj);
      }
    });
  });

  let thirdLevel = test.filter((cat) => {
    let identifier = cat.identifier;
    let splitByDot = identifier.split('.');
    let withoutBeginning = splitByDot.slice(3);
    let nestedLevel = withoutBeginning.length;
    let first = withoutBeginning[0];
    return !first.includes('MP') && nestedLevel === 3;
  });

  let withStandards = thirdLevel.map((o) => {
    o.standards = [];
    return o;
  });

  withStandards.forEach((obj) => {
    let identifier = obj.identifier;
    let splitByDot = identifier.split('.');
    let parentIdent = splitByDot.slice(0, 5).join('.');

    withDomains.forEach((domainObj) => {
      domainObj.domains.forEach((dom => {
          if (dom.identifier === parentIdent) {
            dom.topics.push(obj);
          }
      }));
    });
  });

  let fourthLevel = test.filter((cat) => {
    let identifier = cat.identifier;
    let splitByDot = identifier.split('.');
    let withoutBeginning = splitByDot.slice(3);
    let nestedLevel = withoutBeginning.length;
    let first = withoutBeginning[0];
    return !first.includes('MP') && nestedLevel === 4;
  });

  let withSubStandards = fourthLevel.map((obj) => {
    obj.substandards = [];
    return obj;
  });

  withSubStandards.forEach((obj) => {
    let identifier = obj.identifier;
    let splitByDot = identifier.split('.');
    let parentIdent = splitByDot.slice(0, 6).join('.');

    withDomains.forEach((domainObj) => {
      domainObj.domains.forEach((dom => {
        dom.topics.forEach((topic) => {
          if (topic.identifier === parentIdent) {
            topic.standards.push(obj);
          }
        });
      }));
    });
  });

  let fifthLevel = test.filter((cat) => {
    let identifier = cat.identifier;
    let splitByDot = identifier.split('.');
    let withoutBeginning = splitByDot.slice(3);
    let nestedLevel = withoutBeginning.length;
    let first = withoutBeginning[0];
    return !first.includes('MP') && nestedLevel === 5;
  });

  fifthLevel.forEach((obj) => {
    let identifier = obj.identifier;
    let splitByDot = identifier.split('.');
    let parentIdent = splitByDot.slice(0, 7).join('.');

    withDomains.forEach((domainObj) => {
      domainObj.domains.forEach((dom => {
        dom.topics.forEach((topic) => {
          topic.standards.forEach(sub => {
            if (sub.identifier === parentIdent) {
              sub.substandards.push(obj);
            }
          });
        });
      }));
    });
  });

    withDomains.forEach((grade) => {
    grade.domains.forEach((domain) => {
      domain.topics = domain.topics.sort((a, b) => {
        let aIdentifier = a.identifier.split('.')[5];
        let bIdentifier = b.identifier.split('.')[5];
        return aIdentifier.charCodeAt(0) - bIdentifier.charCodeAt(0);
      });
      domain.topics.forEach((topic) => {
        topic.standards = topic.standards.sort((a, b) => {
          let aIdentifier = a.identifier.split('.')[6];
          let bIdentifier = b.identifier.split('.')[6];
          return aIdentifier.charCodeAt(0) - bIdentifier.charCodeAt(0);
        });
        topic.standards.forEach((standard) => {
          standard.substandards = standard.substandards.sort((a, b) => {
            let aIdentifier = a.identifier.split('.')[7];
            let bIdentifier = b.identifier.split('.')[7];
            return aIdentifier.charCodeAt(0) - bIdentifier.charCodeAt(0);
          });
        });
      });
    });
  });

  console.log('CategoryList', withDomains);
});



//SAMPLE TREE STURUCTURE;
    let categories = [ // eslint-disable-line no-unused-vars
      {
        name: 'Grade K',
        identifier: 'CCSS.Math.Content.K',
        url: '',
        domains: [
          {
            name: 'Countaing & Cardinality',
            identifier: 'CCSS.Math.Content.K.CC',
            url: '',
            topics: [
              {
                name: 'Know number names and the count sequence',
                identifier: 'CCSS.Math.Content.K.CC.A',
                standards: [
                  {
                    name: 'Count to 100 by ones and by tens',
                    identifier: 'CCSS.Math.Content.K.CC.A.1',
                    url: '',
                  },
                  {
                    name: 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
                    identifier: 'CCSS.Math.Content.K.CC.A.2',
                    url: '',
                  },
                  {
                    name: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).',
                    identifier: 'CCSS.Math.Content.K.CC.A.3',
                    url: '',
                  },
                ]
              },
              {
                name: 'Count to tell the number of objects',
                identifier: 'CCSS.Math.Content.K.CC.B',
                url: '',
                standards: [{
                    name: 'Understand the relationship between numbers and quantities; connect counting to cardinality',
                    identifier: 'CCSS.Math.Content.K.CC.B.4',
                    url: '',
                    substandards: [
                      {
                        name: 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
                        identifier: 'CCSS.Math.Content.K.CC.B.4.A',
                        url: '',
                      },
                      {
                        name: 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.',
                        identifier: 'CCSS.Math.Content.K.CC.B.4.B',
                        url: '',
                      },
                      {
                        name: 'Understand that each successive number name refers to a quantity that is one larger.',
                        identifier: 'CCSS.Math.Content.K.CC.B.4.C',
                        url: '',
                      }
                    ],
                  },
                  {
                    name: 'Count to answer "how many?" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1-20, count out that many objects.',
                    identifier: 'CCSS.Math.Content.K.CC.B.4',
                    url: '',
                  },
                ]
              },
              {
                name: 'Compare numbers',
                identifier: 'CCSS.Math.Content.K.CC.C',
                url: '',
                standards: [{
                    name: 'Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies.',
                    identifier: 'CCSS.Math.Content.K.CC.C.6',
                    url: '',
                  },
                  {
                    name: 'Compare two numbers between 1 and 10 presented as written numerals.',
                    identifier: 'CCSS.Math.Content.K.CC.C.7',
                    url: '',
                  },
                ]
              },
            ]
          },
          {
            name: 'Operations & Algebraic Thinking',
            identifier: 'CCSS.Math.Content.K.OA',
            url: '',
            topics: [
              {
                name: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from',
                identifier: 'CCSS.Math.Content.K.OA.A',
                url: '',
                standards: [
                  {
                    name: 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.',
                    identifier: 'CCSS.Math.Content.K.OA.A.1',
                    url: '',
                  },
                  {
                    name: 'Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.',
                    identifier: 'CCSS.Math.Content.K.OA.A.2',
                    url: '',
                  },
                  {
                    name: 'Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation (e.g., 5 = 2 + 3 and 5 = 4 + 1).',
                    identifier: 'CCSS.Math.Content.K.OA.A.3',
                    url: '',
                  }, {
                    name: 'For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.',
                    identifier: 'CCSS.Math.Content.K.OA.A.4',
                    url: '',
                  }, {
                    name: 'Fluently add and subtract within 5',
                    identifier: 'CCSS.Math.Content.K.OA.A.5',
                    url: '',
                  },
                ]
              }
            ],
          },
        ]
      },
  ];