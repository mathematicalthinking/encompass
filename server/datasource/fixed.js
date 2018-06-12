/**
  * # Fixtures
  * @description Here we define fixtures that can be used by the app in place of real data
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  * @todo This should be retired in favour of ../../test/data/*
  */

module.exports = {
  workspace: function(req, res, next) {
    res.send({
      workspace: {
        id: 1,
        name: 'workspace 1',
        submissions: [1,2],
        folders: [1],
        comments: [1, 2, 3, 4]
      },
      submission: [{
        id: 1,
        shortAnswer: 'short1',
        longAnswer: 'long 1',
        selections: [1, 2]
      }, {
        id: 2,
        shortAnswer: '222',
        longAnswer: 'long 2',
        selections: [3]
      }],
      folder: [{
        id: 1,
        name: 'Kyle\'s Folders 1',
        children: [2,3],
        taggings: [1]
      }, {
        id: 2,
        name: 'Good',
        parent: 1,
        taggings: [2]
      }, {
        id:3,
        name: 'Bad',
        parent: 1
      }],
      selection: [{
        id: 1,
        text: 'blah',
        comments: [1, 2],
        taggings: [1, 2],
        submission: 1
      }, {
        id: 2,
        text: 'selection 2',
        comments: [3],
        submission: 1
      }, {
        id: 3,
        text: 'selection 3',
        comments: [4],
        submission: 2
      }],
      comment: [{
        id: 1,
        type: 'notice',
        text: 'i notice ...',
        useForResponse: true,
        selection: 1
      },{
        id: 2,
        type: 'wonder',
        text: 'i wonder...',
        useForResponse: false,
        selection: 1
      },{
        id: 3,
        type: 'wonder',
        text: 'i wonder...',
        selection: 2
      },{
        id: 4,
        type: 'notice',
        text: 'fascinating',
        selection: 3
      }],
      tagging: [{
        id: 1,
        selection: 1,
        folder: 1
      }, {
        id: 2,
        selection: 1,
        folder: 2
      }]
    });
  }
};
