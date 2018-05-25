/* global emq, moduleFor, moduleForModel, sinon */
// Computed props from pdSet model should work as expected

emq.globalize();
emq.setResolver(Ember.DefaultResolver.create({ namespace: Encompass }));

moduleForModel('pdSet', 'PD Set Model');

test('label', function() {
  var pdSet = this.subject({
    id: 'Fake PD Set',
    count: 50
  });

  var expected = 'Fake PD Set (50 submissions)';
  equal(pdSet.get('label'), expected);
});
