/* global emq, moduleFor, sinon */

//pressing enter in a folder input saves it

//folder onchange triggers a save

//drag and drop reordering at the same level doesn't work (need above/below drop target)
//drag and drop reordering to top level doesn't work (need better defined drop targets)


emq.globalize();
emq.setResolver(Ember.DefaultResolver.create({ namespace: Encompass }));

moduleFor('controller:folder', 'Folder Controller', {
  needs: ['controller:folders', 'controller:workspaceSubmission', 'controller:workspace', 'controller:application', 'controller:comments']
});

test('editing a folder', function() {
  var controller = this.subject();
  var model = {
    get: sinon.stub(),
    save: sinon.spy()
  };

  var promise = new Ember.RSVP.Promise(function(resolve, reject) {
    resolve('whatever');
  });

  model.get.withArgs('workspace').returns(promise);
  model.get.withArgs('isDirty').returns(true);

  controller.set('content', model);

  controller.send('editFolderName');

  promise.then(function(it) {
    ok(model.save.calledOnce, 'the model was saved');
  });

  ok(model.save.notCalled, 'the model was saved');

});
