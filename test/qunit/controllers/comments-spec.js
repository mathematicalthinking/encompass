/* global emq, moduleFor, sinon */

emq.globalize();
emq.setResolver(Ember.DefaultResolver.create({ namespace: Encompass }));

moduleFor('controller:comments', 'Comments Controller', {
  needs: ['controller:folders', 'controller:workspaceSubmissions', 'controller:workspaceSubmission', 'controller:workspace', 'controller:application', 'controller:comments']
});

test('making a comment', function() {
  var controller = this.subject();
  controller.set('text', 'new comment text');

  controller.send('createComment');

  ok(!controller.get('text'), 'the text is cleared out');

});
