/* global emq, moduleFor */

//pressing enter in a folder input saves it

//folder onchange triggers a save

//drag and drop reordering at the same level doesn't work (need above/below drop target)
//drag and drop reordering to top level doesn't work (need better defined drop targets)


emq.globalize();
emq.setResolver(Ember.DefaultResolver.create({ namespace: Encompass }));

moduleFor('controller:folders', 'Folders Controller', {
  needs: ['controller:workspace', 'controller:application', 'controller:comments']
});

test('it works', function() {
  var folders = this.subject();
  var workspace = folders.get('controllers.workspace');
  
  ok(folders, 'folder controller is injected');
  ok(workspace, 'workspace controller is injected');

});

