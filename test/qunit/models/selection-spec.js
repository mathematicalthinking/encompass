/* global emq, moduleFor, moduleForModel, sinon */
// Computed props from selection model should work as expected

emq.globalize();
emq.setResolver(Ember.DefaultResolver.create({ namespace: Encompass }));

moduleForModel('selection', 'Selection Model', {
  needs: ['model:user', 'model:tagging', 'model:comment', 'model:submission', 'model:workspace', 'model:folder', 'model:response']
});

test('link', function() {
  var selection = this.subject({
    id: 3
  });

  var expected = '#/workspaces/null/submissions/null/selections/3';
  equal(selection.get('link'), expected);
});
