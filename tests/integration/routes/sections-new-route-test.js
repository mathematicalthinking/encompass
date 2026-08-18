import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Integration | Route | sections/new', function (hooks) {
  setupTest(hooks);

  test('beforeModel redirects students back to sections', function (assert) {
    assert.expect(1);

    class RouterStub extends Service {
      transitionTo(routeName) {
        assert.strictEqual(routeName, 'sections', 'students are redirected');
      }
    }

    class CurrentUserStub extends Service {
      isStudent = true;
      user = { organization: Promise.resolve({ id: 'org-1' }) };
    }

    class StoreStub extends Service {
      query() {
        return [];
      }
    }

    this.owner.register('service:router', RouterStub);
    this.owner.register('service:current-user', CurrentUserStub);
    this.owner.register('service:store', StoreStub);

    const route = this.owner.lookup('route:sections/new');
    route.beforeModel();
  });

  test('model returns users, addableTeachers, and the current user organization', async function (assert) {
    const teacher = { id: 'teacher-1', username: 'teacher', accountType: 'T' };
    const pdAdmin = { id: 'pd-1', username: 'pdadmin', accountType: 'P' };
    const student = { id: 'student-1', username: 'student', accountType: 'S' };
    const organization = { id: 'org-1', name: 'STEM Academy' };

    class StoreStub extends Service {
      queryCalls = [];

      query(modelName, params) {
        this.queryCalls.push({ modelName, params });
        return Promise.resolve([teacher, pdAdmin, student]);
      }
    }

    class CurrentUserStub extends Service {
      isStudent = false;
      user = {
        organization: Promise.resolve(organization),
      };
    }

    this.owner.register('service:store', StoreStub);
    this.owner.register('service:current-user', CurrentUserStub);

    const route = this.owner.lookup('route:sections/new');
    const store = this.owner.lookup('service:store');
    const model = await route.model();

    assert.strictEqual(
      model.organization,
      organization,
      'uses current user organization'
    );
    assert.deepEqual(
      model.users,
      [teacher, pdAdmin, student],
      'returns all queried users'
    );
    assert.deepEqual(
      model.addableTeachers,
      [teacher, pdAdmin],
      'filters out student accounts from addableTeachers'
    );
    assert.deepEqual(store.queryCalls, [{ modelName: 'user', params: {} }]);
  });
});
