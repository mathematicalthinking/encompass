/* global emq, moduleFor, moduleForModel, sinon */
// Computed props from submission model should work as expected

emq.globalize();
emq.setResolver(Ember.DefaultResolver.create({ namespace: Encompass }));

moduleForModel('submission', 'Submission Model', {
  needs: ['model:user', 'model:workspace', 'model:selection', 'model:comment', 'model:response', 'model:tagging', 'model:folder']
});

test('imageUrl', function() {
  var submission = this.subject({
    attachment: {
      uploadedFileId: 1,
      savedFileName: 'fakeFile'
    }
  });

  var expected = 'http://mathforum.org/pows/uploaded-images/fakeFile';
  equal(submission.get('imageUrl'), expected);
});

test('label', function() {
  var submission = this.subject({
    student: 'Damola',
    createDate: new Date(2014, 0, 14),
  });

  var expected = 'Damola on 1/14/2014 (undefined)';
  equal(submission.get('label'), expected);
});

test('puzzleUrl', function() {
  var submission = this.subject({
    puzzle: {
      puzzleId: 100,
      title: 'Test',
    }
  }); 

  var expected = '/library/go.html?destination=100';
  equal(submission.get('puzzleUrl'), expected);
});

test('isStatic', function() {
  var submission = this.subject();
  var expected = true;

  equal(submission.get('isStatic'), expected);
});
