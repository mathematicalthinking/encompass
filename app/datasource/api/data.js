/**
  * # Math Forum Data
  * @description Here we define default data to be used in the application
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */

var folderSets = [
  {
    _id: 'default',
    name: 'Math Forum Default Folders'
  },
  {
    _id: 'none',
    name: 'None'
  },
  {
    _id: 'simple',
    name: 'Simple Folder Set'
  }
];

var simple = [
  {
    name: 'Reasonable',
    weight: 100,
    children: [
      { name: 'Correct', weight: 101},
      { name: 'Incorrect', weight: 102}
    ]
  },
  {
    name: 'Ridiculous',
    weight: 200
  }
];

/* The default Math Forum folder set (defined according to the Math Forum Rubric) */
var mathforumFolders = [
  { 
    name: 'Interpretation',
    weight: 100, 
    children: [
      { name: 'Answered The Question(s)', weight: 101 },
      { name: 'Answered Different Question(s)', weight: 102 },
      { name: 'Tried All Parts', weight: 103 },
      { name: 'Missed A Part', weight: 104 }
    ]
  },
  { 
    name: 'Strategy',
    weight: 200, 
    children: [
      { name: 'Mathematically Sound', weight: 201},
      { name: 'Got Lucky', weight: 202}
    ]
  },
  { 
    name: 'Accuracy',
    weight: 300, 
    children: [
      { name: 'Units', weight: 301},
      { name: 'Vocabulary', weight: 302},
      { name: 'Calculations', weight: 303},
      { name: 'Run-On Equations', weight: 304}
    ]
  },
  { 
    name: 'Completeness',
    weight: 400, 
    children: [
      { name: 'Missing Step/Explanation', weight: 401},
      { name: 'Why Statement(s)', weight: 402}
    ]
  },
  { 
    name: 'Clarity',
    weight: 500, 
    children: [
      { name: 'Unclear', weight: 501},
      { name: 'Careless', weight: 502},
      { name: 'Good Organization', weight: 503},
      { name: 'Run-On Paragraph(s)', weight: 504}
    ]
  },
  { 
    name: 'Reflection',
    weight: 600, 
    children: [
      { name: 'Revised', weight: 601},
      { name: 'Made Connections', weight: 602},
      { name: 'Checked Work', weight: 603},
      { name: 'Summarized Process', weight: 604},
      { name: 'Gave Hint', weight: 605},
      { name: 'Reasonable?', weight: 606},
      { name: 'Why Hard', weight: 607},
      { name: 'Where Stuck', weight: 608}
    ]
  }
];


module.exports.mathforumFolders = mathforumFolders;
module.exports.simple = simple;
module.exports.folderSets = folderSets;
