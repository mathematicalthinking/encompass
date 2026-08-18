import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Integration | Route | sections/index', function (hooks) {
  setupTest(hooks);

  test('route model returns student flag and all sections', async function (assert) {
    const sections = [{ id: 'section-1' }, { id: 'section-2' }];

    class StoreStub extends Service {
      calls = [];

      findAll(modelName) {
        this.calls.push(modelName);
        return sections;
      }
    }

    class CurrentUserStub extends Service {
      isStudent = true;
    }

    this.owner.register('service:store', StoreStub);
    this.owner.register('service:current-user', CurrentUserStub);

    const route = this.owner.lookup('route:sections');
    const store = this.owner.lookup('service:store');
    const model = await route.model();

    assert.true(model.isStudent, 'returns the current user student flag');
    assert.strictEqual(model.sections, sections, 'returns the store result');
    assert.deepEqual(store.calls, ['section'], 'loads all section records');
  });

  test('route model preserves non-student state for the index template', async function (assert) {
    class StoreStub extends Service {
      findAll() {
        return [];
      }
    }

    class CurrentUserStub extends Service {
      isStudent = false;
    }

    this.owner.register('service:store', StoreStub);
    this.owner.register('service:current-user', CurrentUserStub);

    const route = this.owner.lookup('route:sections');
    const model = await route.model();

    assert.false(model.isStudent, 'non-student users keep create-class access');
    assert.deepEqual(model.sections, [], 'still returns sections collection');
  });
});
