import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

module(
  'Integration | Component | add-create-student | selectize regression',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.owner.register(
        'service:sweet-alert',
        class extends Service {
          showToast() {}
        }
      );

      this.owner.register(
        'service:current-user',
        class extends Service {
          user = {
            id: 'teacher-1',
            organization: { id: 'org-1' },
          };
        }
      );

      const student1 = EmberObject.create({
        id: 'student-1',
        _id: 'student-1',
        username: 'existing_student',
      });

      this.student1 = student1;

      this.owner.register(
        'service:store',
        class extends Service {
          peekAll(modelName) {
            // Real store.peekAll returns an array-like supporting slice();
            // return plain arrays so the component's .slice() works.
            if (modelName === 'user') {
              return [student1];
            }

            return [];
          }

          peekRecord(modelName, id) {
            if (modelName === 'user' && id === 'student-1') {
              return student1;
            }
            return null;
          }

          findRecord(modelName, id) {
            if (modelName === 'user' && id === 'student-1') {
              return Promise.resolve(student1);
            }
            return Promise.resolve(null);
          }
        }
      );

      const students = A([]);

      this.set(
        'section',
        EmberObject.create({
          id: 'section-1',
          students,
          save() {
            return Promise.resolve(this);
          },
        })
      );
      this.set('students', students);
      this.set('sectionPassword', 'class-pass');
    });

    test('selecting existing student via selectize does not throw and adds student', async function (assert) {
      assert.expect(2);

      await render(hbs`
        <AddCreateStudent
          @section={{this.section}}
          @students={{this.students}}
          @sectionPassword={{this.sectionPassword}}
        />
      `);

      await settled();

      const selectElement = this.element.querySelector('#select-add-student');
      const selectize = selectElement?.selectize;

      assert.ok(selectize, 'selectize instance is initialized');

      selectize.addItem('student-1');
      await settled();

      assert.true(
        this.students.includes(this.student1),
        'selected existing student is added to section students'
      );
    });
  }
);
