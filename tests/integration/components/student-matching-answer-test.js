import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const MONGO_ID = '507f1f77bcf86cd799439011';

class UtilityMethodsStub extends Service {
  isValidMongoId(value) {
    return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
  }

  isNullOrUndefined(value) {
    return value === null || value === undefined;
  }
}

class SelectizeInputStub extends Component {
  @tracked createdOption = null;

  @action
  invokeCreate() {
    if (typeof this.args.create !== 'function') {
      return;
    }
    this.args.create('  Added Name  ', (option) => {
      this.createdOption = option;
    });
  }
}

module('Integration | Component | student-matching-answer', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.owner.register('component:selectize-input', SelectizeInputStub);
    this.owner.register(
      'template:components/selectize-input',
      hbs`
        <div class='selectize-input-stub' data-input-id={{@inputId}}>
          <button
            type='button'
            class='stub-add-student'
            {{on 'click' (fn @onItemAdd '507f1f77bcf86cd799439011' (hash added=true))}}
          >
            Add Existing Student
          </button>

          <button
            type='button'
            class='stub-remove-student'
            {{on 'click' (fn @onItemRemove '507f1f77bcf86cd799439011' null)}}
          >
            Remove Existing Student
          </button>

          <button
            type='button'
            class='stub-add-name'
            {{on 'click' (fn @onItemAdd 'New Student' (hash added=true))}}
          >
            Add Name
          </button>

          <button
            type='button'
            class='stub-remove-name'
            {{on 'click' (fn @onItemRemove 'New Student' null)}}
          >
            Remove Name
          </button>

          <button
            type='button'
            class='stub-invoke-create'
            {{on 'click' this.invokeCreate}}
          >
            Invoke Create
          </button>

          {{#if this.createdOption}}
            <p class='created-option'>
              {{this.createdOption.username}}|{{this.createdOption.id}}
            </p>
          {{/if}}

          <ul class='stub-options'>
            {{#each @initialOptions as |option|}}
              <li class='stub-option'>{{option.id}}:{{option.username}}</li>
            {{/each}}
          </ul>

          <ul class='stub-items'>
            {{#each @initialItems as |item|}}
              <li class='stub-item'>{{item}}</li>
            {{/each}}
          </ul>
        </div>
      `
    );

    this.studentMap = {
      [MONGO_ID]: {
        id: MONGO_ID,
        username: 'existing_student',
      },
    };

    this.addedStudentNames = [];
    this.statusCallCount = 0;
    this.checkStatus = () => {
      this.statusCallCount += 1;
    };
  });

  async function renderComponent(context, overrides = {}) {
    context.answer = {
      id: 'answer-1',
      explanationImage: {
        id: 'img-1',
        imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB',
        fileNameDisplay: 'student-work.png',
      },
      students: [],
      studentNames: [],
      ...overrides,
    };

    await render(hbs`
      <StudentMatchingAnswer
        @answer={{this.answer}}
        @selectedSection={{this.selectedSection}}
        @checkStatus={{this.checkStatus}}
        @studentMap={{this.studentMap}}
        @addedStudentNames={{this.addedStudentNames}}
        @newNameFilter={{this.newNameFilter}}
      />
    `);
  }

  test('it renders image content and computes the selectize input id', async function (assert) {
    await renderComponent(this);

    assert.dom('.student-matching-answer').exists('root class is rendered');
    assert.dom('.card-heading').hasText('student-work.png');
    assert
      .dom('.selectize-input-stub')
      .hasAttribute('data-input-id', 'select-add-studentimg-1');
  });

  test('it toggles full-image preview open and closed', async function (assert) {
    await renderComponent(this);

    assert.dom('.full-image').doesNotExist('full image starts closed');

    await click('.overlay button');
    assert.dom('.full-image').exists('full image opens');

    await click('.full-image button');
    assert.dom('.full-image').doesNotExist('full image closes');
  });

  test('it adds and removes an existing student id via selectize callbacks', async function (assert) {
    await renderComponent(this);

    await click('.stub-add-student');

    assert.strictEqual(
      this.answer.students.length,
      1,
      'student is added to submission students'
    );
    assert.strictEqual(
      this.answer.students[0].id,
      MONGO_ID,
      'added student has expected id'
    );
    assert.strictEqual(
      this.statusCallCount,
      1,
      'checkStatus callback is called after add'
    );
    assert
      .dom('.stub-options')
      .includesText(
        `${MONGO_ID}:existing_student`,
        'selected student option remains available after selection'
      );

    await click('.stub-remove-student');

    assert.strictEqual(
      this.answer.students.length,
      0,
      'student is removed from submission students'
    );
    assert.strictEqual(
      this.statusCallCount,
      2,
      'checkStatus callback is called after remove'
    );
  });

  test('it adds and removes plain-text student names', async function (assert) {
    await renderComponent(this);

    await click('.stub-add-name');

    assert.deepEqual(
      this.answer.studentNames,
      ['New Student'],
      'plain-text name is added to submission studentNames'
    );
    assert.deepEqual(
      this.addedStudentNames,
      ['New Student'],
      'added student names list is updated for cross-answer reuse'
    );
    assert.strictEqual(this.statusCallCount, 1, 'checkStatus is called on add');

    await click('.stub-remove-name');

    assert.deepEqual(
      this.answer.studentNames,
      [],
      'plain-text name is removed from submission studentNames'
    );
    assert.deepEqual(
      this.addedStudentNames,
      ['New Student'],
      'addedStudentNames is intentionally retained after removal'
    );
    assert.strictEqual(
      this.statusCallCount,
      2,
      'checkStatus is called on remove'
    );
  });

  test('it trims custom created names from selectize create callback', async function (assert) {
    await renderComponent(this);

    await click('.stub-invoke-create');

    assert
      .dom('.created-option')
      .hasText('Added Name|Added Name', 'created name is trimmed and returned');
  });

  test('it merges existing students and names into initial selectize items', async function (assert) {
    await renderComponent(this, {
      students: [{ id: MONGO_ID, username: 'existing_student' }],
      studentNames: ['Typed Name'],
    });

    assert
      .dom('.stub-item')
      .exists({ count: 2 }, 'two initial items are passed to selectize');
    assert.dom('.stub-items').includesText(MONGO_ID);
    assert.dom('.stub-items').includesText('Typed Name');
  });
});
