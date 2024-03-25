import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | instance-tracker', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:instance-tracker');
    assert.ok(service);
  });

  test('setCurrentInstance and getCurrentInstance work as expected', function (assert) {
    let service = this.owner.lookup('service:instance-tracker');
    let instance = { data: 'some data' };
    let id = 'uniqueID';

    service.setCurrentInstance(instance, id);
    let retrievedInstance = service.getCurrentInstance(id);

    assert.deepEqual(
      retrievedInstance,
      instance,
      'The instance is correctly set and retrieved.'
    );

    // Test default ID behavior
    service.setCurrentInstance(instance);
    retrievedInstance = service.getCurrentInstance();

    assert.deepEqual(
      retrievedInstance,
      instance,
      'The instance is correctly set and retrieved using the default ID.'
    );
  });

  test('clearCurrentInstance removes the instance as expected', function (assert) {
    let service = this.owner.lookup('service:instance-tracker');
    let instance = { data: 'some data' };
    let id = 'uniqueID';

    service.setCurrentInstance(instance, id);
    service.clearCurrentInstance(id);

    assert.strictEqual(
      service.getCurrentInstance(id),
      null,
      'The instance is correctly cleared.'
    );

    // Test clearing with default ID
    service.setCurrentInstance(instance);
    service.clearCurrentInstance();

    assert.strictEqual(
      service.getCurrentInstance(),
      null,
      'The instance is correctly cleared using the default ID.'
    );
  });

  test('getCurrentInstance returns null if no instance is set', function (assert) {
    let service = this.owner.lookup('service:instance-tracker');
    let id = 'nonExistentID';

    assert.strictEqual(
      service.getCurrentInstance(id),
      null,
      'Retrieving a non-existent instance returns null.'
    );
  });
});
