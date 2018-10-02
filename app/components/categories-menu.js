Encompass.CategoriesMenuComponent = Ember.Component.extend({
  elementId: 'categories',

  init: function () {
    let categories = [
      {
        name: 'Grade K',
        identifier: 'CCSS.Math.Content.K',
        domains: [
          {
            name: 'Countaing & Cardinality',
            identifier: 'CCSS.Math.Content.K.CC',
            topics: [
              {
                name: 'Know number names and the count sequence',
                identifier: 'CCSS.Math.Content.K.CC.A',
                standards: [
                  {
                    name: 'Count to 100 by ones and by tens',
                    identifier: 'CCSS.Math.Content.K.CC.A.1',
                  },
                  {
                    name: 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
                    identifier: 'CCSS.Math.Content.K.CC.A.2',
                  },
                  {
                    name: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).',
                    identifier: 'CCSS.Math.Content.K.CC.A.3',
                  },
                ]
              },
              {
                name: 'Count to tell the number of objects',
                identifier: 'CCSS.Math.Content.K.CC.B',
                standards: [{
                    name: 'Understand the relationship between numbers and quantities; connect counting to cardinality',
                    identifier: 'CCSS.Math.Content.K.CC.B.4',
                    substandards: [
                      {
                        name: 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
                        identifier: 'CCSS.Math.Content.K.CC.B.4.A',
                      },
                      {
                        name: 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.',
                        identifier: 'CCSS.Math.Content.K.CC.B.4.B',
                      },
                      {
                        name: 'Understand that each successive number name refers to a quantity that is one larger.',
                        identifier: 'CCSS.Math.Content.K.CC.B.4.C',
                      }
                    ],
                  },
                  {
                    name: 'Count to answer "how many?" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1-20, count out that many objects.',
                    identifier: 'CCSS.Math.Content.K.CC.B.4',
                  },
                ]
              },
              {
                name: 'Compare numbers',
                identifier: 'CCSS.Math.Content.K.CC.C',
                standards: [{
                    name: 'Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies.',
                    identifier: 'CCSS.Math.Content.K.CC.C.6',
                  },
                  {
                    name: 'Compare two numbers between 1 and 10 presented as written numerals.',
                    identifier: 'CCSS.Math.Content.K.CC.C.7',
                  },
                ]
              },
            ]
          },
          {
            name: 'Operations & Algebraic Thinking',
            identifier: 'CCSS.Math.Content.K.OA',
            topics: [
              {
                name: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from',
                identifier: 'CCSS.Math.Content.K.OA.A',
                standards: [
                  {
                    name: 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.',
                    identifier: 'CCSS.Math.Content.K.OA.A.1'
                  },
                  {
                    name: 'Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.',
                    identifier: 'CCSS.Math.Content.K.OA.A.2'
                  },
                  {
                    name: 'Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation (e.g., 5 = 2 + 3 and 5 = 4 + 1).',
                    identifier: 'CCSS.Math.Content.K.OA.A.3'
                  }, {
                    name: 'For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.',
                    identifier: 'CCSS.Math.Content.K.OA.A.4'
                  }, {
                    name: 'Fluently add and subtract within 5',
                    identifier: 'CCSS.Math.Content.K.OA.A.5'
                  },
                ]
              }
            ],
          },
        ]
      },
  ];

    this.set('categories', categories);
    this._super(...arguments);
    this.get('store').findAll('category').then((categories) => {
      let categoryList = categories;
      categoryList.forEach((category) => {
        let identifier = category.get('identifier');
        if (identifier.startsWith('CCSS.Math.Content.K')) {
          console.log('identifier', identifier);
        }
      });
    });
  },

});


