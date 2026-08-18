import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';
import { A } from '@ember/array';

module('Integration | Route | sections/section', function (hooks) {
  setupTest(hooks);

  test('route model loads section, groups, and cachedProblems for the section page', async function (assert) {
    const calls = [];
    const section = { id: 'section-42', name: 'Geometry' };
    const groups = A([{ id: 'group-1' }]);
    const cachedProblems = A([{ id: 'problem-1' }]);

    class StoreStub extends Service {
      query(modelName, params) {
        calls.push({ method: 'query', modelName, params });
        return Promise.resolve(groups);
      }

      findRecord(modelName, id) {
        calls.push({ method: 'findRecord', modelName, id });
        return Promise.resolve(section);
      }

      findAll(modelName) {
        calls.push({ method: 'findAll', modelName });
        return Promise.resolve(cachedProblems);
      }
    }

    this.owner.register('service:store', StoreStub);

    const route = this.owner.lookup('route:sections/section');
    const model = await route.model({ section_id: 'section-42' });

    assert.strictEqual(model.section, section, 'returns the section record');
    assert.strictEqual(model.groups, groups, 'returns groups for the section');
    assert.strictEqual(
      model.cachedProblems,
      cachedProblems,
      'returns cached problems for assignment creation'
    );
    assert.deepEqual(calls, [
      {
        method: 'query',
        modelName: 'group',
        params: { section: 'section-42' },
      },
      {
        method: 'findRecord',
        modelName: 'section',
        id: 'section-42',
      },
      {
        method: 'findAll',
        modelName: 'problem',
      },
    ]);
  });
});
